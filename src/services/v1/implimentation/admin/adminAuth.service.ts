import { inject, injectable } from "tsyringe";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { ValidationError } from "../../../../utils/errors/validation.error";
import { generateAccessToken, generateRefreshToken } from "../../../../utils/jwt.util";
import IAdmin from "../../../../entities/v1/adminEntity";
import { LoginResponse } from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";
import logger from "../../../../utils/logger.util";
import { IAdminAuthRepository } from "../../../../repositories/v1/interfaces/admin/IAdminAuth.repository";
import { IAdminAuthService } from "../../interfaces/admin/IAdminAuth.service";
@injectable()
export default class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject("IAdminAuthRepository") private _adminAuthReposritory: IAdminAuthRepository
  ) {}

  async verifyLogin(email: string, password: string): Promise<LoginResponse<IAdmin,Role.ADMIN>> {
    try {
      logger.info("Admin login attempt", { email });
      // let admin = await this._adminReposritory.findByEmail({ email });
      // if (!admin)
      //   throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
      // const passwordVerified = await compare(password, admin.password);
const adminPassword = process.env.ADMIN_PASSWORD;
const  adminEmail= process.env.ADMIN_EMAIL;

  if (!adminEmail || !adminPassword) {
        throw new Error(ResponseMessage.ADMIN_CREDENTIALS_NOT_CONFIGURED);
      }

const admin:IAdmin = {
  _id:"objectId",
  name:"admin",
  email:adminEmail,
  role:Role.ADMIN
};

      if (password !== adminPassword || adminEmail !== email ){
        logger.warn("Invalid admin login credentials", { attemptedEmail: email });
        throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);
      } else {
          const role = Role.ADMIN;
                const accessToken = generateAccessToken({data:admin,role:role});
                const refreshToken = generateRefreshToken({data:admin,role:role});
                logger.info("Admin login successful", { adminEmail });
                return {admin,accessToken,refreshToken};
      }
    } catch (error) {
      throw error;
    }
  }
}
