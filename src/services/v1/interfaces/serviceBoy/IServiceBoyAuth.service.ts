import { Role } from "../../../../constants/Role";
import { GoogleLogin, ServiceBoyLoginResponse } from "../../../../entities/v1/authenticationEntity";

export interface IServiceBoyAuthService {
  register(name: string, email: string, password: string, mobile: string): Promise<void>;
  generateOTP(email: string): Promise<void>;
  verifyOTP(
    email: string,
    otp: string,
    oldRefreshToken?: string
  ): Promise<ServiceBoyLoginResponse | void>;
  serviceBoyLogin(
    email: string,
    password: string,
    oldRefreshToken?: string
  ): Promise<ServiceBoyLoginResponse>;
  resendOtp(email: string): Promise<void>;
  setNewAccessToken(refreshToken: string): Promise<any>;
  forgotPassword(email: string): Promise<string>;
  resetPasswordTokenVerify(email: string, token: string): Promise<void>;
  googleAuth(
    data: GoogleLogin,
    oldRefreshToken?: string
  ): Promise<ServiceBoyLoginResponse | undefined>;
  resetPassword(email: string, password: string): Promise<void>;
  resetPasswordLink(token: string, email: string, role: Role): Promise<void>;
}
