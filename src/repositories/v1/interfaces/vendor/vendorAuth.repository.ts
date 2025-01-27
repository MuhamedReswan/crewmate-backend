export interface IVendorAuthRepository {
    findVendorByEmail(email:string):Promise<any>;
}