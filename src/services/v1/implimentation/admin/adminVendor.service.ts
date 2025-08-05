import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../../repositories/v1/implimentation/vendor/vendor.repository";
import IVendor from "../../../../entities/v1/vendorEntity";
import logger from "../../../../utils/logger.util";
import { VerificationStatusType } from "../../../../constants/verificationStatus";
import { Types } from "mongoose";

export interface IAdminVendorService{
loadAllPendingVerification():Promise<Partial<IVendor>[] | undefined>
verifyVendor(id:string, status:VerificationStatusType):Promise<Partial<IVendor> | undefined>
}

@injectable()
export default class AdminVendorService implements IAdminVendorService {
    constructor(@inject("IVendorRepository")private _vendorRepository: IVendorRepository){}


    loadAllPendingVerification = async ():Promise<Partial<IVendor>[] | undefined> =>{
try {
   const allPendingVerification  = await this._vendorRepository.loadAllVendorendingVerification()
   logger.info("allPendingVerification in adminVendor service ",{data:allPendingVerification})
   if(allPendingVerification) return allPendingVerification
    return 
} catch (error) {
   throw error 
}
}



verifyVendor = async (id:string, status:VerificationStatusType):Promise<Partial<IVendor> | undefined> =>{
try {
   const _id = new Types.ObjectId(id)
const UpdateVerification = this._vendorRepository.updateVendor({ _id: _id }, { isVerified: status });
logger.info("vendor UpdateVerification",UpdateVerification);
   return UpdateVerification;
} catch (error) {
   throw error;
}
}
}