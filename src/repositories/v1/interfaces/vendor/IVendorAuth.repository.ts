import IVendor from "../../../../entities/v1/vendorEntity";

export interface IVendorAuthRepository {
    findVendorByEmail(email:string):Promise<IVendor | null>;
createVendor(vendorData: Partial<IVendor>): Promise<IVendor>
updateVendorPassword(email:string, password:string): Promise<void>


}