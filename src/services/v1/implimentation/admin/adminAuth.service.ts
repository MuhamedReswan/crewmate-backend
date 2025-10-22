import { inject, injectable } from "tsyringe";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { ValidationError } from "../../../../utils/errors/validation.error";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../utils/jwt.util";
import IAdmin from "../../../../entities/v1/adminEntity";
import { LoginResponse } from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";
import logger from "../../../../utils/logger.util";
import { IAdminAuthRepository } from "../../../../repositories/v1/interfaces/admin/IAdminAuth.repository";
import { IAdminAuthService } from "../../interfaces/admin/IAdminAuth.service";
import bcrypt from "bcrypt";

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
      let adminData = await this._adminAuthReposritory.findByEmail({ email });
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
}
