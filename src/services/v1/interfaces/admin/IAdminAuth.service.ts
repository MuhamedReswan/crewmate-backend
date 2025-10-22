import { Role } from "../../../../constants/Role";
import IAdmin from "../../../../entities/v1/adminEntity";
import { LoginResponse } from "../../../../entities/v1/authenticationEntity";
import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";

export interface IAdminAuthService {
    verifyLogin(email: string, password: string): Promise<LoginResponse<IAdmin,Role.ADMIN>>  
    setNewAccessToken(refreshToken: string): Promise<CustomTokenResponse>     
}