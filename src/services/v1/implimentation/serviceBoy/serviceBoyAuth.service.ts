import { injectable, inject } from "tsyringe";
import { IServiceBoyAuthRepository } from "../../../../repositories/v1/interfaces/serviceBoy/IServiceBoyAuth.repository";
import {
  deleteRedisData,
  getRedisData,
  setRedisData,
} from "../../../../utils/redis.util";
import {
  IServiceBoyAuthService,
} from "../../interfaces/serviceBoy/IServiceBoyAuthService";
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
import bcrypt from "bcrypt";
import { ValidationError } from "../../../../utils/errors/validation.error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../../utils/jwt.util";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import * as crypto from "crypto";
import {
  GoogleLogin,
  LoginResponse,
  Register,
} from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";

@injectable()
export default class ServiceBoyAuthService implements IServiceBoyAuthService {
  private serviceBoyAuthRepository: IServiceBoyAuthRepository;

  constructor(
    @inject("IServiceBoyAuthRepository")
    serviceBoyAuthRepository: IServiceBoyAuthRepository
  ) {
    this.serviceBoyAuthRepository = serviceBoyAuthRepository;
  }

  async register(
    name: string,
    email: string,
    password: string,
    mobile: string
  ): Promise<void> {
    try {
      console.log("ServiceBoyServie register got");
      const existingServiceBoy =
        await this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
      console.log("existingServiceBoy", existingServiceBoy);
      if (existingServiceBoy) {
        console.log("bad request thrown");
        throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);
      }
      let setServiceBoyData = await setRedisData(
        `serviceBoy:${email}`,
        JSON.stringify({ name, email, password, mobile }),
        3600
      );
      console.log("setServiceBoyData", setServiceBoyData);
      let registerFromRedis = await getRedisData(`serviceBoy:${email}`);
      console.log("registerFromRedis", registerFromRedis);
    } catch (error) {
      console.log("bad ");
      throw error;
    }
  }

  async generateOTP(email: string) {
    try {
      const serviceBoy =
        await this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
      if (serviceBoy)
        throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_VERIFIED);

      const otp = createOtp();
      await setRedisData(`otpB:${email}`, JSON.stringify({ otp }), 120);
      let savedOtp = await getRedisData(`otpB:${email}`);
      console.log("savedOtp", savedOtp);
      await sendOtpEmail(email, otp);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyOTP(email: string, otp: string): Promise<IServiceBoy | void> {
    try {
      console.log("within verify otp in service");
      console.log(`email:${email},otp:${otp} serivce`);

      const savedOtp = await getRedisData(`otpB:${email}`);
      console.log("savedOtp", savedOtp);
      if (!savedOtp) throw new ExpiredError("OTP expired");

      const { otp: savedOtpValue } = JSON.parse(savedOtp);
      console.log("savedOtpValue", savedOtpValue);
      console.log("otp", otp);
      if (otp !== savedOtpValue) throw new ValidationError("Invalid OTP");

      let deleteotp = await deleteRedisData(`otpB:${email}`);
      console.log("deleteotp", deleteotp);

      let serviceBoyData = await getRedisData(`serviceBoy:${email}`);
      console.log("serviceBoyData  from serivice", serviceBoyData);
      if (serviceBoyData) {
        let serviceBoyDataObject = JSON.parse(serviceBoyData);
        console.log(
          "parsed serviceBoyData  from serivice",
          serviceBoyDataObject
        );

        let number = 1;
        const servicerId = `A-${number}`;

        serviceBoyDataObject.password = await hashPassword(
          serviceBoyDataObject.password
        );
        serviceBoyDataObject.servicerId = servicerId;
        serviceBoyDataObject.name = serviceBoyDataObject.name.toLowerCase();
        let createdBoy = await this.serviceBoyAuthRepository.createServiceBoy(
          serviceBoyDataObject
        );
        if (!createdBoy) {
          throw new BadrequestError(ResponseMessage.USER_NOT_CREATED);
        }
        number++;
        console.log("createdBoy from service", createdBoy);
        await deleteRedisData(`serviceBoy:${email}`);
        return createdBoy;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async serviceBoyLogin(
    email: string,
    password: string
  ): Promise<LoginResponse<IServiceBoy, Role.SERVICE_BOY>> {
    try {
      const serviceBoy =
        await this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
      console.log("serviceBoy login service", serviceBoy);
      if (!serviceBoy) {
        throw new NotFoundError(ResponseMessage.INVALID_CREDINTIALS);
      }
      const validPassword = await bcrypt.compare(password, serviceBoy.password);
      if (!validPassword) throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);
      console.log("validPassword login service", validPassword);
      const role = Role.SERVICE_BOY;
      const accessToken = generateAccessToken({ data: serviceBoy, role: role });
      const refreshToken = generateRefreshToken({
        data: serviceBoy,
        role: role,
      });
      console.log("refresh token", refreshToken);
      console.log("accessToken token", accessToken);
      return { serviceBoy, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<void> {
    try {
      console.log(`"email from resend otp service":${email}`);

      const redisData = await getRedisData(`otpB${email}`);
      console.log("redisData from resend otp service", redisData);

      await deleteRedisData(`otpB${email}`);
      const otp = createOtp();
      await setRedisData(`otpB:${email}`, JSON.stringify({ otp }), 120);
      let savedOtp = await getRedisData(`otpB:${email}`);
      console.log("savedOtp", savedOtp);
      await sendOtpEmail(email, otp);
    } catch (error) {
      throw error;
    }
  }

  async setNewAccessToken(Token: string): Promise<any> {
    try {
      console.log("wihtin setNewAccessToken serviceBOyAth service")
      const decoded = await verifyRefreshToken(Token);
      const role = decoded?.role ?? Role.SERVICE_BOY;
      console.log("sevice boy from setNewAccessToken from service", decoded);
      console.log("role from setNewAccessToken from service", role);

      if (!decoded || !decoded.email) {
        throw new UnAuthorizedError(ResponseMessage.INVALID_REFRESH_TOKEN);
      }
      const serviceBoy =
        await this.serviceBoyAuthRepository.findServiceBoyByEmail(
          decoded.email
        );
      if (!serviceBoy) throw new UnAuthorizedError(ResponseMessage.USER_NOT_FOUND);
      if(serviceBoy.isBlocked) throw new ValidationError(ResponseMessage.USER_BLOCKED_BY_ADMIN)

      const accessToken = await generateAccessToken({ data: serviceBoy, role });
      const refreshToken = await generateRefreshToken({ data: serviceBoy, role });
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
        await this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
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
      await deleteRedisData(`forgotToken-SB:${email}`)
    } catch (error) {
      throw error;
    }
  };


  googleAuth = async (data: GoogleLogin): Promise<LoginResponse<IServiceBoy, Role.SERVICE_BOY> | undefined> => {
    try {
      const {googleToken} = data;

      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${googleToken}` }
    });

    console.log("response",response);

    if (!response.ok) {
        throw new ValidationError('google login falied');
    }
    
    const responseData = await response.json();
    console.log("responseData",responseData);
let serviceBoy;
    serviceBoy = await this.serviceBoyAuthRepository.findServiceBoyByEmail(responseData.email);   

    if(!serviceBoy){
        let {name,email, email_verified:isVerified,picture:profileImage } = responseData;
        console.log("name before lowercase",name);
        name= name.toLowerCase()
        console.log("name after lowercase",name);
         serviceBoy = await this.serviceBoyAuthRepository.createServiceBoy(
          {name,email,isVerified,profileImage}
        );
      }

     if(!serviceBoy) return

    const role = Role.SERVICE_BOY;
    const accessToken = generateAccessToken({ data: serviceBoy, role: role });
    const refreshToken = generateRefreshToken({
      data: serviceBoy,
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
      await this.serviceBoyAuthRepository.updateServiceBoyPassword(
        email,
        hashedPassword
      );
    } catch (error) {
      throw error;
    }
  };

  resetPasswordLink = async ( email: string, token: string, role:Role): Promise<void> => {
    try {
      await sendForgotPasswordLink(email, token,role);
    } catch (error) {
      throw error;
    }
  };
}
