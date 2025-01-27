import { RequestHandler } from "../../../../utils/type";

 export interface IVendorAuthService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>

}