import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { Role } from "../../../../constants/Role";
import IAdmin from "../../../../entities/v1/adminEntity";
import { LoginResponse } from "../../../../entities/v1/authenticationEntity";
import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";
import { IAdminAuthRepository } from "../../../../repositories/v1/interfaces/admin/IAdminAuth.repository";
import { handleSessionOnLogin } from "../../../../utils/authSession.utils";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../../utils/jwt.util";
import logger from "../../../../utils/logger.util";
import { IAdminAuthService } from "../../interfaces/admin/IAdminAuth.service";

@injectable()
export default class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject("IAdminAuthRepository")
    private _adminAuthReposritory: IAdminAuthRepository
  ) {}

  async verifyLogin(
    email: string,
    password: string,
    oldRefreshToken?: string
  ): Promise<LoginResponse<IAdmin, Role.ADMIN>> {
    try {
      logger.info("Admin login attempt", { email });
      const adminData = await this._adminAuthReposritory.findByEmail(email);
      const isValidPassword =
        adminData?.password && (await bcrypt.compare(password, adminData.password));

      if (!adminData || !isValidPassword) {
        logger.warn(`Invalid credentials for email: ${email}`);
        throw new UnAuthorizedError(ResponseMessage.INVALID_CREDINTIALS);
      } else {
        const role = Role.ADMIN;

        const accessToken = generateAccessToken({
          id: adminData._id.toString(),
          email: adminData.email,
          name: adminData.name,
          role: role,
        });
        const refreshToken = generateRefreshToken({
          id: adminData._id.toString(),
          email: adminData.email,
          name: adminData.name,
          role: role,
        });

        await handleSessionOnLogin(adminData._id.toString(), refreshToken, oldRefreshToken);
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
      logger.debug("decoded data in setNewAccessToken in admin auth service", {
        decoded,
      });

      if (!decoded || !decoded.email) {
        throw new UnAuthorizedError(ResponseMessage.INVALID_REFRESH_TOKEN);
      }
      const admin = await this._adminAuthReposritory.findByEmail(decoded.email);
      if (!admin) throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
      const accessToken = await generateAccessToken({
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: Role.ADMIN,
      });

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
