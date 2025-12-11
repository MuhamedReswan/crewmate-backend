import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../../repositories/v1/implimentation/vendor/vendor.repository";
import IVendor from "../../../../entities/v1/vendorEntity";
import logger from "../../../../utils/logger.util";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/status";
import { Types } from "mongoose";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { getVerificationEmailTemplate } from "../../../../emailTemplates/accountVerification";
import { sendEmail } from "../../../../utils/email.util";
import { Role } from "../../../../constants/Role";

export interface IAdminVendorService{
loadAllPendingVerification():Promise<Partial<IVendor>[] | undefined>
verifyVendor(id:string, status:VerificationStatusType,reason?: string):Promise<Partial<IVendor> | undefined>
getVendorById(id:string, isVerified?:IVendor["isVerified"] ):Promise<Partial<IVendor> | undefined>
getPaginatedVendors(page: number, limit: number, search: string, isBlocked:boolean|undefined)
: Promise<PaginatedResponse<IVendor> | undefined>
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


verifyVendor = async (
  id: string,
  status: VerificationStatusType,
  reason?: string
): Promise<Partial<IVendor> | undefined> => {
  try {
    const _id = new Types.ObjectId(id);

    const updateData: Partial<IVendor> = {
      isVerified: status,
      rejectionReason: status === VerificationStatus.Rejected ? reason : null,
    };

    const updatedVendor = await this._vendorRepository.updateVendor(
      { _id },
      updateData,
    );

    if (!updatedVendor) {
      throw new BadrequestError(ResponseMessage.VENDOR_NOT_EXIST);
    }

    const emailStatus = status === VerificationStatus.Verified ? 'APPROVED' : 'REJECTED';
    const emailSubject = `Crewmate Account Verification - ${emailStatus}`;
    const emailHtml = getVerificationEmailTemplate(
      updatedVendor.name || 'User',
      emailStatus,    
      "vendor",
      status === VerificationStatus.Rejected ? reason : undefined
    );

    await sendEmail({
      to: updatedVendor.email,
      subject: emailSubject,
      html: emailHtml,
    });

    return updatedVendor;
  } catch (error) {
    throw error;
  }
};


getVendorById = async (id:string, isVerified?:IVendor["isVerified"] ):Promise<Partial<IVendor> | undefined> =>{
try {
   const _id = new Types.ObjectId(id)
const UpdateVerification = this._vendorRepository.findVendor({ _id, isVerified });
logger.info("vendor UpdateVerification",UpdateVerification);
   return UpdateVerification;
} catch (error) {
   throw error;
}
}

  getPaginatedVendors = async(page: number, limit: number, search: string, isBlocked:boolean): Promise<PaginatedResponse<IVendor> | undefined> => {
   try {
      return this._vendorRepository.findVendorPaginated(page, limit, search, isBlocked);
   } catch (error) {
      throw error;
   }
  }
}