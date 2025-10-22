import { inject, injectable } from "tsyringe";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { ValidationError } from "../../../../utils/errors/validation.error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../../utils/jwt.util";
import IAdmin from "../../../../entities/v1/adminEntity";
import { LoginResponse } from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";
import logger from "../../../../utils/logger.util";
import { IAdminAuthRepository } from "../../../../repositories/v1/interfaces/admin/IAdminAuth.repository";
import { IAdminAuthService } from "../../interfaces/admin/IAdminAuth.service";
import bcrypt from "bcrypt";
import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import { NotFoundError } from "../../../../utils/errors/notFound.error";

@injectable()
export default class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject("IAdminAuthRepository")
    private _adminAuthReposritory: IAdminAuthRepository
  ) {}

  async verifyLogin(
    email: string,
    password: string
  ): Promise<LoginResponse<IAdmin, Role.ADMIN>> {
    try {
      logger.info("Admin login attempt", { email });
      let adminData = await this._adminAuthReposritory.findByEmail(email );
      const isValidPassword =
        adminData?.password &&
        (await bcrypt.compare(password, adminData.password));

      if (!adminData || !isValidPassword) {
        logger.warn(`Invalid credentials for email: ${email}`);
        throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);
      } else {
        const role = Role.ADMIN;
        const accessToken = generateAccessToken({
          data: adminData,
          role: role,
        });
        const refreshToken = generateRefreshToken({
          data: adminData,
          role: role,
        });
        logger.info("Admin login successful", { adminData });
        return { [role]: adminData, accessToken, refreshToken };
      }
    } catch (error) {
      throw error;
    }
  }

    async setNewAccessToken(refreshToken: string): Promise<CustomTokenResponse> {
    try {
      const decoded = await verifyRefreshToken(refreshToken);
      const role = decoded?.role === Role.ADMIN ? Role.ADMIN : Role.ADMIN;
      logger.debug("decoded data in setNewAccessToken in admin auth service",{decoded})

      if (!decoded || !decoded.email) {
        throw new UnAuthorizedError(ResponseMessage.INVALID_REFRESH_TOKEN);
      }
      const admin = await this._adminAuthReposritory.findByEmail(
        decoded.email
      );
      if (!admin) throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
      const accessToken = await generateAccessToken({ data: admin, role });
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
}
