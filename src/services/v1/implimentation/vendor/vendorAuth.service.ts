import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { IVendorAuthService } from "../../interfaces/vendor/IVendorAuth.service";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import {
  deleteRedisData,
  getRedisData,
  setRedisData,
} from "../../../../utils/redis.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { IVendorAuthRepository } from "../../../../repositories/v1/interfaces/vendor/IVendorAuth.repository";
import {
  createOtp,
  sendForgotPasswordLink,
  sendOtpEmail,
} from "../../../../utils/otp.util";
import { ExpiredError } from "../../../../utils/errors/expired.error";
import { hashPassword } from "../../../../utils/password.util";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { ValidationError } from "../../../../utils/errors/validation.error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../../utils/jwt.util";
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";
import {
  GoogleLogin,
  VendorLoginResponse,
} from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";
import logger from "../../../../utils/logger.util";
import { mapToVendorLoginDTO } from "../../../../mappers.ts/vendor.mapper";
import { storeGoogleImageToS3 } from "../../../../utils/googleImageupload.util";
import { VerificationStatus } from "../../../../constants/verificationStatus";

@injectable()
export default class VendorAuthService implements IVendorAuthService {
  constructor(
    @inject("IVendorAuthRepository")
    private _vendorAuthRepository: IVendorAuthRepository
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    mobile: string
  ): Promise<void> {
    try {
      logger.info("Vendor registration attempt", { email });
      const existingVendor = await this._vendorAuthRepository.findVendorByEmail(
        email
      );
      if (existingVendor)
        throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);

      await setRedisData(
        `vendor:${email}`,
        JSON.stringify({ name, email, password, mobile }),
        3600
      );
      await getRedisData(`vendor:${email}`);
      logger.debug("Vendor data stored in Redis", { email });
    } catch (error) {
      throw error;
    }
  }

  async generateOTP(email: string) {
    try {
      const vendor = await this._vendorAuthRepository.findVendorByEmail(email);
      if (vendor)
        throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_VERIFIED);

      const otp = createOtp();
      await setRedisData(`otpV:${email}`, JSON.stringify({ otp }), 60);
      const savedOtp = await getRedisData(`otpV:${email}`);
      logger.debug("Saved OTP from generateOTP", { savedOtp });
      await sendOtpEmail(email, otp);
    } catch (error) {
      throw error;
    }
  }

  async verifyOTP(email: string, otp: string): Promise<VendorLoginResponse | void> {
    try {
      logger.debug("Verifying OTP in service", { email, otp });
      const savedOtp = await getRedisData(`otpV:${email}`);
      logger.debug("Saved OTP from Redis", { savedOtp });
      if (!savedOtp) throw new ExpiredError(ResponseMessage.OTP_EXPIRED);

      const { otp: savedOtpValue } = JSON.parse(savedOtp);
      if (otp !== savedOtpValue)
        throw new BadrequestError(ResponseMessage.INVALID_OTP);

      await deleteRedisData(`otpV:${email}`);
      logger.debug("OTP deleted from Redis", { email });
      const vendorData = await getRedisData(`vendor:${email}`);
      if (vendorData) {
        const vendorDataObject = JSON.parse(vendorData);
        vendorDataObject.password = await hashPassword(
          vendorDataObject.password
        );

       let createdVendor =  await this._vendorAuthRepository.createVendor(vendorDataObject);
          if (!createdVendor) {
          throw new BadrequestError(ResponseMessage.USER_NOT_CREATED);
        }

        logger.info("Vendor created from Redis data", { email });
        await deleteRedisData(`vendor:${email}`);

        const vendor = mapToVendorLoginDTO(createdVendor);
      const role = Role.VENDOR;

      const accessToken = generateAccessToken({
        data: {
          _id: createdVendor._id,
          email: createdVendor.email,
          name: createdVendor.name,
        },
        role,
      });

      const refreshToken = generateRefreshToken({
        data: {
          _id: createdVendor._id,
          email: createdVendor.email,
          name: createdVendor.name,
        },
        role,
      });

      return { vendor, accessToken, refreshToken };
      }
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<void> {
    try {
      await deleteRedisData(`otpV${email}`);
      const otp = createOtp();
      await setRedisData(`otpV:${email}`, JSON.stringify({ otp }), 60);
      logger.debug("OTP resent and saved in Redis", {
        email,
        otp,
        otpTime: new Date(),
      });
      await getRedisData(`otpV:${email}`);
      await sendOtpEmail(email, otp);
    } catch (error) {
      throw error;
    }
  }

  async vendorLogin(
    email: string,
    password: string
  ): Promise<VendorLoginResponse> {
    try {
      const vendorData = await this._vendorAuthRepository.findVendorByEmail(
        email
      );
      if (!vendorData) {
        throw new NotFoundError(ResponseMessage.INVALID_CREDINTIALS);
      }
      if (!vendorData.password)
        throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);

      const validPassword = await bcrypt.compare(password, vendorData.password);
      if (!validPassword)
        throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);

      const vendor = mapToVendorLoginDTO(vendorData);
      const role = Role.VENDOR;

      const accessToken = generateAccessToken({
        data: {
          _id: vendorData._id,
          email: vendorData.email,
          name: vendorData.name,
        },
        role,
      });

      const refreshToken = generateRefreshToken({
        data: {
          _id: vendorData._id,
          email: vendorData.email,
          name: vendorData.name,
        },
        role,
      });

      return { vendor, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  forgotPassword = async (email: string): Promise<string> => {
    try {
      const vendor = await this._vendorAuthRepository.findVendorByEmail(email);
      if (!vendor) throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
      const token = crypto.randomBytes(8).toString("hex");
      await setRedisData(`forgotToken:${email}`, token, 1800);
      return token;
    } catch (error) {
      throw error;
    }
  };

  resetPasswordTokenVerify = async (
    email: string,
    token: string
  ): Promise<void> => {
    try {
      const forgotTokenData = await getRedisData(`forgotToken:${email}`);
      if (!forgotTokenData) {
        throw new ExpiredError(ResponseMessage.FORGOT_PASSWORD_TOKEN_EXPIRED);
      }
      if (forgotTokenData != token) {
        throw new ValidationError(
          ResponseMessage.INVALID_FORGOT_PASSWORD_TOKEN
        );
      }
      await deleteRedisData(`forgotToken:${email}`);
    } catch (error) {
      throw error;
    }
  };

  resetPassword = async (email: string, password: string): Promise<void> => {
    try {
      const hashedPassword = await hashPassword(password);
      await this._vendorAuthRepository.updateVendorPassword(
        email,
        hashedPassword
      );
    } catch (error) {
      throw error;
    }
  };

  resetPasswordLink = async (
    token: string,
    email: string,
    role: Role
  ): Promise<void> => {
    try {
      logger.info("Sending reset password link", { email, role });
      await sendForgotPasswordLink(email, token, role);
    } catch (error) {
      throw error;
    }
  };

  async setNewAccessToken(refreshToken: string): Promise<CustomTokenResponse> {
    try {
      const decoded = await verifyRefreshToken(refreshToken);
      const role = decoded?.role === Role.VENDOR ? Role.VENDOR : Role.VENDOR;

      if (!decoded || !decoded.email) {
        throw new UnAuthorizedError(ResponseMessage.INVALID_REFRESH_TOKEN);
      }
      const vendor = await this._vendorAuthRepository.findVendorByEmail(
        decoded.email
      );
      if (!vendor) throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
       if (vendor.isBlocked) throw new ValidationError(ResponseMessage.USER_BLOCKED_BY_ADMIN);
       
      const accessToken = await generateAccessToken({ data: vendor, role });
      return {
        accessToken,
        refreshToken,
        message: ResponseMessage.ACCESS_TOKEN_SET,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  googleAuth = async (
    data: GoogleLogin
  ): Promise<VendorLoginResponse> => {
    try {
      const { googleToken } = data;
      logger.info("Google auth started");

      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${googleToken}` },
        }
      );

      if (!response.ok) {
        throw new ValidationError(ResponseMessage.GOOGLE_AUTH_FAILED);
      }

      const responseData = await response.json();
      logger.info("google Auth vendor details", responseData);
      
      let vendorData  = await this._vendorAuthRepository.findVendorByEmail(
        responseData.email
      );

      if (!vendorData ) {
        let { name, email, picture: profileImage } = responseData;
        let isVerified = VerificationStatus.Pending;
        name = name.toLowerCase();

            let profileImageKey: string | undefined = undefined;
        if (profileImage) {
          try {
            profileImageKey = await storeGoogleImageToS3(profileImage,name);
            logger.info("Uploaded Google profile image to S3", { profileImageKey });
          } catch (uploadError) {
            logger.warn("Failed to upload Google image to S3, using original URL instead", uploadError);
            profileImageKey = profileImage; 
          }
        }

        vendorData  = await this._vendorAuthRepository.createVendor({
          name,
          email,
          isVerified,
          profileImage:profileImageKey,
        });
      }

 const vendor = mapToVendorLoginDTO(vendorData); 
    const role = Role.VENDOR;

    const accessToken = generateAccessToken({
      data: {
        _id: vendorData._id,
        email: vendorData.email,
        name: vendorData.name,
      },
      role,
    });

    const refreshToken = generateRefreshToken({
      data: {
        _id: vendorData._id,
        email: vendorData.email,
        name: vendorData.name,
      },
      role,
    });

    return { vendor, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };
}
