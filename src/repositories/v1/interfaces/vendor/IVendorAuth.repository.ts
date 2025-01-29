import { Register } from "../../../../entities/v1/authenticationEntity";

export interface IVendorAuthRepository {
    findVendorByEmail(email:string):Promise<any>;
createVendor(vendorData: Register): Promise<void>
updateVendorPassword(email:string, password:string): Promise<void>


}