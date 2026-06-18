import { inject, injectable } from "tsyringe";
import { IAdminUserManagementService } from "../../interfaces/admin/IAdminUserManagement.service";
import { IVendorRepository } from "../../../../repositories/v1/interfaces/vendor/IVendor.repository";
import { IServiceBoyRepository } from "../../../../repositories/v1/interfaces/serviceBoy/IServiceBoy.repository";
import { Request } from "express";
import { Role } from "../../../../constants/Role";
import { UserType } from "../../../../constants/userType";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import IVendor from "../../../../entities/v1/vendorEntity";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/status";
import { Types } from "mongoose";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { getVerificationEmailTemplate } from "../../../../emailTemplates/accountVerification";
import { sendEmail } from "../../../../utils/email.util";
import { PaginatedResponse } from "../../../../types";

@injectable()
export default class AdminUserManagementService implements IAdminUserManagementService{
constructor(
@inject("IVendorRepository") private readonly _vendorRepository:IVendorRepository,

@inject("IServiceBoyRepository") private readonly _serviceBoyRepository:IServiceBoyRepository
){}

loadAllPendingVerification = async(userType:UserType):Promise<Partial<IServiceBoy>[] | Partial<IVendor>[] | undefined> =>{
try {

      const repository =
    userType === UserType.VENDOR
      ? this._vendorRepository
      : this._serviceBoyRepository;

   const allPendingVerification  = await repository.loadAllPendingVerification()
return allPendingVerification;
} catch (error) {
   throw error 
}
}


getUserById = async(userType:UserType, id:string,isVerified?:VerificationStatusType):Promise<Partial<IVendor> | Partial<IServiceBoy> | undefined> =>{

  const repository =
    userType === UserType.VENDOR
      ? this._vendorRepository
      : this._serviceBoyRepository;

       const _id = new Types.ObjectId(id)

 if(isVerified){
       return repository.findUser({_id,isVerified});
   }

     return repository.findUser({_id});

}


verifyUser = async (
  id: string,
  status: VerificationStatusType,
  reason?: string,
  userType?:UserType
): Promise<Partial<IVendor> | undefined> => {
  try {

      const repository =
    userType === UserType.VENDOR
      ? this._vendorRepository
      : this._serviceBoyRepository;

      const user =
    userType === UserType.VENDOR
      ? 'vendor'
      : 'service-boy';

    const _id = new Types.ObjectId(id);

    const updateData: Partial<IVendor> = {
      isVerified: status,
      rejectionReason: status === VerificationStatus.Rejected ? reason : null,
    };

    const updatedUser = await repository.updateUser(
      { _id },
      updateData,
    );

    if (!updatedUser) {
      throw new BadrequestError(ResponseMessage.USER_NOT_EXIST);
    }

    const emailStatus = status === VerificationStatus.Verified ? 'APPROVED' : 'REJECTED';
    const emailSubject = `Crewmate Account Verification - ${emailStatus}`;
    const emailHtml = getVerificationEmailTemplate(
      updatedUser.name || 'User',
      emailStatus,    
      user,
      status === VerificationStatus.Rejected ? reason : undefined
    );

    await sendEmail({
      to: updatedUser.email,
      subject: emailSubject,
      html: emailHtml,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};


getPaginatedUsers = async(userType:UserType, page: number, limit: number, search: string, isBlocked:boolean): Promise<PaginatedResponse<IServiceBoy | IVendor> | undefined> => {
   try {

    const repository = 
    userType === UserType.VENDOR
    ? this._serviceBoyRepository
    : this._vendorRepository

      return repository.findPaginatedUsers(page, limit, search, isBlocked);
   } catch (error) {
      throw error;
   }
  }
  

}