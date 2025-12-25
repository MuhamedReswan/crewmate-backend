import { injectable, inject } from "tsyringe";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { IServiceBoyAuthRepository } from "../../../../repositories/v1/interfaces/serviceBoy/IServiceBoyAuth.repository";
import redisClient, {
  deleteRedisData,
  getRedisData,
  setRedisData,
} from "../../../../utils/redis.util";
import { IServiceBoyAuthService } from "../../interfaces/serviceBoy/IServiceBoyAuth.service";
import {
  sendForgotPasswordLink,
  sendOtpEmail,
} from "../../../../utils/otp.util";
import { createOtp } from "../../../../utils/otp.util";
import { hashPassword } from "../../../../utils/password.util";
import { ExpiredError } from "../../../../utils/errors/expired.error";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { ValidationError } from "../../../../utils/errors/validation.error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../../utils/jwt.util";
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import {
  GoogleLogin,
  ServiceBoyLoginResponse,
} from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";
import logger from "../../../../utils/logger.util";
import { mapToServiceBoyLoginDTO } from "../../../../mappers.ts/serviceBoy.mapper";
import { storeGoogleImageToS3 } from "../../../../utils/googleImageupload.util";
import { VerificationStatus } from "../../../../constants/status";
import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";

@injectable()
export default class ServiceBoyAuthService implements IServiceBoyAuthService {
  private _serviceBoyAuthRepository: IServiceBoyAuthRepository;

  constructor(
    @inject("IServiceBoyAuthRepository")
    _serviceBoyAuthRepository: IServiceBoyAuthRepository
  ) {
    this._serviceBoyAuthRepository = _serviceBoyAuthRepository;
  }

  async register(
    name: string,
    email: string,
    password: string,
    mobile: string
  ): Promise<void> {
    try {
      const existingServiceBoy =
        await this._serviceBoyAuthRepository.findServiceBoyByEmail(email);
      if (existingServiceBoy) {
        logger.warn(`Email already used: ${email}`);
        throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);
      }
         await setRedisData(
        `serviceBoy:${email}`,
        JSON.stringify({ name, email, password, mobile }),
        3600
      );
      await getRedisData(`serviceBoy:${email}`);
      logger.info(`Registration data cached for ${email}`);
    } catch (error) {
      throw error;
    }
  }

  async generateOTP(email: string) {
    try {
      const serviceBoy =
        await this._serviceBoyAuthRepository.findServiceBoyByEmail(email);
      if (serviceBoy)
        throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_VERIFIED);

      const otp = createOtp();
      await setRedisData(`otpB:${email}`, JSON.stringify({ otp }), 60);
      await sendOtpEmail(email, otp);
      logger.info(`OTP sent to ${email}  otp-----${otp}`);
    } catch (error) {
      throw error;
    }
  }

  async verifyOTP(email: string, otp: string): Promise< ServiceBoyLoginResponse| void> {
    try {
      logger.info(`Verifying OTP for: ${email}`);
      logger.debug(`Incoming OTP data`, { email, otp });
      const savedOtp = await getRedisData(`otpB:${email}`);
      logger.debug(`Fetched saved OTP from Redis`, { savedOtp });
      if (!savedOtp) throw new ExpiredError("OTP expired");

      const { otp: savedOtpValue } = JSON.parse(savedOtp);
      logger.debug(`Parsed savedOtpValue`, { savedOtpValue });
      if (otp !== savedOtpValue) throw new ValidationError("Invalid OTP");

      await deleteRedisData(`otpB:${email}`);

      let serviceBoyData = await getRedisData(`serviceBoy:${email}`);
      if (serviceBoyData) {
        let serviceBoyDataObject = JSON.parse(serviceBoyData);
        logger.debug("Parsed serviceBoyData from service", {
          serviceBoyDataObject,
        });

const number = await redisClient.incr("serviceBoy:idCounter"); // auto-increment
const servicerId = `A-${number}`;

        serviceBoyDataObject.password = await hashPassword(
          serviceBoyDataObject.password
        );
        serviceBoyDataObject.servicerId = servicerId;
        serviceBoyDataObject.name = serviceBoyDataObject.name.toLowerCase();
        let createdBoy = await this._serviceBoyAuthRepository.createServiceBoy(
          serviceBoyDataObject
        );

        if (!createdBoy) {
          throw new BadrequestError(ResponseMessage.USER_NOT_CREATED);
        }
        await deleteRedisData(`serviceBoy:${email}`);


         const serviceBoy = mapToServiceBoyLoginDTO(createdBoy);

      const role = Role.SERVICE_BOY;
      const accessToken = generateAccessToken({
        data: {
          _id: createdBoy._id,
          email: createdBoy.email,
          name: createdBoy.name,
        },
        role: role,
      });
      const refreshToken = generateRefreshToken({
        data: {
          _id: createdBoy._id,
          email: createdBoy.email,
          name: createdBoy.name,
        },
        role: role,
      });
      return { serviceBoy, accessToken, refreshToken };
      }
    } catch (error) {
      throw error;
    }
  }

  async serviceBoyLogin(
    email: string,
    password: string
  ): Promise<ServiceBoyLoginResponse> {
    try {
      let serviceBoyData =
        await this._serviceBoyAuthRepository.findServiceBoyByEmail(email);

      const isValidPassword =
        serviceBoyData?.password &&
        (await bcrypt.compare(password, serviceBoyData.password));

      if (!serviceBoyData || !isValidPassword) {
        logger.warn(`Invalid credentials for email: ${email}`);
        throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);
      }

      const serviceBoy = mapToServiceBoyLoginDTO(serviceBoyData);

      const role = Role.SERVICE_BOY;
      const accessToken = generateAccessToken({
        data: {
          _id: serviceBoyData._id,
          email: serviceBoyData.email,
          name: serviceBoyData.name,
        },
        role: role,
      });
      const refreshToken = generateRefreshToken({
        data: {
          _id: serviceBoyData._id,
          email: serviceBoyData.email,
          name: serviceBoyData.name,
        },
        role: role,
      });
      return { serviceBoy, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<void> {
    try {
      logger.info(`Resend OTP for email service layer: ${email}`);
      await getRedisData(`otpB${email}`);
      await deleteRedisData(`otpB${email}`);
      const otp = createOtp();
      logger.info("resend otp------------",{otp});
      await setRedisData(`otpB:${email}`, JSON.stringify({ otp }), 60);
      await getRedisData(`otpB:${email}`);
      await sendOtpEmail(email, otp);
    } catch (error) {
      throw error;
    }
  }

  async setNewAccessToken(Token: string): Promise<CustomTokenResponse> {
    try {
      const decoded = await verifyRefreshToken(Token);
      logger.debug("decodedrole", { decoded });
   
      if (!decoded || !decoded.email) {
        throw new UnAuthorizedError(ResponseMessage.INVALID_REFRESH_TOKEN);
      }
      const serviceBoy =
        await this._serviceBoyAuthRepository.findServiceBoyByEmail(
          decoded.email
        );
      if (!serviceBoy)
        throw new UnAuthorizedError(ResponseMessage.USER_NOT_FOUND);
      if (serviceBoy.isBlocked)
        throw new ValidationError(ResponseMessage.USER_BLOCKED_BY_ADMIN);

      const accessToken = await generateAccessToken({
        data: serviceBoy,
        role: Role.SERVICE_BOY,
      });
      const refreshToken = await generateRefreshToken({
        data: serviceBoy,
        role: Role.SERVICE_BOY,
      });
      logger.info(`New tokens generated for: ${decoded.email}`);
      return {
        accessToken,
        refreshToken,
        message: ResponseMessage.TOKEN_SET_SUCCESS,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  forgotPassword = async (email: string): Promise<string> => {
    try {
      const serviceBoy =
        await this._serviceBoyAuthRepository.findServiceBoyByEmail(email);
      if (!serviceBoy) throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
      const token = crypto.randomBytes(8).toString("hex");
      await setRedisData(`forgotToken-SB:${email}`, token, 1800);
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
      const forgotTokenData = await getRedisData(`forgotToken-SB:${email}`);
      if (!forgotTokenData) {
        throw new ExpiredError(ResponseMessage.FORGOT_PASSWORD_TOKEN_EXPIRED);
      }
      if (forgotTokenData != token) {
        throw new ValidationError(
          ResponseMessage.INVALID_FORGOT_PASSWORD_TOKEN
        );
      }
      await deleteRedisData(`forgotToken-SB:${email}`);
    } catch (error) {
      throw error;
    }
  };

  googleAuth = async (
    data: GoogleLogin
  ): Promise<ServiceBoyLoginResponse | undefined> => {
    try {
      logger.info("Google auth initiated");
      const { googleToken } = data;
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${googleToken}` },
        }
      );

      if (!response.ok) {
        throw new ValidationError("google login falied");
      }

      const responseData = await response.json();
      let serviceBoyData;
      serviceBoyData =
        await this._serviceBoyAuthRepository.findServiceBoyByEmail(
          responseData.email
        );

        
        if (!serviceBoyData) {
          let { name, email, picture: profileImage } = responseData;
          let isVerified = VerificationStatus.Pending;
          name = name.toLowerCase();
          
          const number = await redisClient.incr("serviceBoy:idCounter"); 
  const servicerId = `A-${number}`;

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
  
        serviceBoyData = await this._serviceBoyAuthRepository.createServiceBoy({
          name,
          email,
          isVerified,
          servicerId:servicerId,
          profileImage:profileImageKey,
        });
      }


      const serviceBoy = mapToServiceBoyLoginDTO(serviceBoyData);
    const role = Role.SERVICE_BOY;
      const accessToken = generateAccessToken({
        data: {
          _id: serviceBoyData._id,
          email: serviceBoyData.email,
          name: serviceBoyData.name,
        },
        role: role,
      });
      const refreshToken = generateRefreshToken({
        data: {
          _id: serviceBoyData._id,
          email: serviceBoyData.email,
          name: serviceBoyData.name,
        },
        role: role,
      });
      
      return { serviceBoy, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  resetPassword = async (email: string, password: string): Promise<void> => {
    try {
      const hashedPassword = await hashPassword(password);
      await this._serviceBoyAuthRepository.updateServiceBoyPassword(
        email,
        hashedPassword
      );
    } catch (error) {
      throw error;
    }
  };

  resetPasswordLink = async (
    email: string,
    token: string,
    role: Role
  ): Promise<void> => {
    try {
      await sendForgotPasswordLink(email, token, role);
    } catch (error) {
      throw error;
    }
  };
}
