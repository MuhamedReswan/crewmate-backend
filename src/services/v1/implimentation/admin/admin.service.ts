import { inject, injectable } from "tsyringe";
import { IAdminService } from "../../interfaces/admin/IAdminService";
import { IAdminRepository } from "../../../../repositories/v1/interfaces/admin/IAdminRepository";
import { compare } from "bcrypt";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { ValidationError } from "../../../../utils/errors/validation.error";
import { generateAccessToken, generateRefreshToken } from "../../../../utils/jwt.util";
import IAdmin from "../../../../entities/v1/adminEntity";
import { LoginResponse } from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";
@injectable()
export default class AdminService implements IAdminService {
  constructor(
    @inject("IAdminRepository") private adminReposritory: IAdminRepository
  ) {}

  async verifyLogin(email: string, password: string): Promise<LoginResponse<IAdmin,'admin'>> {
    try {
      console.log("verifylogin admin service");
      let admin = await this.adminReposritory.findByEmail({ email });
      if (!admin)
        throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
      const passwordVerified = await compare(password, admin.password);
      if (passwordVerified)
        throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);
          const role = Role.ADMIN;
                const accessToken = generateAccessToken({data:admin,role:role});
                const refreshToken = generateRefreshToken({data:admin,role:role});
                console.log("refresh token admin",refreshToken);
                console.log("accessToken token admin",accessToken);
                return {admin,accessToken,refreshToken};

    } catch (error) {
      throw error;
    }
  }
}
