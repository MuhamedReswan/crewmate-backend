import IAdmin from "../../../../entities/v1/adminEntity";
import { LoginResponse } from "../../../../entities/v1/authenticationEntity";

export interface IAdminService {
    verifyLogin(email: string, password: string): Promise<LoginResponse<IAdmin,"admin">>      
}