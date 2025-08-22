import { inject, injectable } from "tsyringe";
import { IServiceBoyRepository } from "../../../../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { Types } from "mongoose";
import { VerificationStatusType } from "../../../../constants/verificationStatus";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import logger from "../../../../utils/logger.util";



export interface IAdminServiceBoyService{
loadAllPendingVerification():Promise<Partial<IServiceBoy>[] | undefined>
verifyServiceBoy(id:string, status:VerificationStatusType):Promise<Partial<IServiceBoy> | undefined>
getPaginatedServiceBoys(page: number, limit: number, search: string, isBlocked:boolean|undefined)
: Promise<PaginatedResponse<IServiceBoy> | undefined>
updateServiceBoyStatus (id:string, status:string):Promise<Partial<IServiceBoy> | undefined>
getServiceBoyById (id:string):Promise<Partial<IServiceBoy> | undefined>
}

@injectable()
export default class AdminServiceBoyService implements IAdminServiceBoyService{
constructor(@inject("IServiceBoyRepository")private _serviceBoyRepository:IServiceBoyRepository){}


loadAllPendingVerification = async ():Promise<Partial<IServiceBoy>[] | undefined> =>{
try {
   const allPendingVerification  = await this._serviceBoyRepository.loadAllSBPendingVerification()
   if(allPendingVerification) return allPendingVerification
    return 
} catch (error) {
   throw error 
}
}



verifyServiceBoy = async (id:string, status:VerificationStatusType):Promise<Partial<IServiceBoy> | undefined> =>{
try {
   const _id = new Types.ObjectId(id)
const UpdateVerification = this._serviceBoyRepository.updateServiceBoy({ _id: _id }, { isVerified: status });
   return UpdateVerification;
} catch (error) {
   throw error;
}
}



   getPaginatedServiceBoys = async(page: number, limit: number, search: string, isBlocked:boolean): Promise<PaginatedResponse<IServiceBoy> | undefined> => {
   try {
      return this._serviceBoyRepository.findServiceBoysPaginated(page, limit, search, isBlocked);
   } catch (error) {
      throw error;
   }
  }


   getServiceBoyById = async(id:string): Promise<Partial<IServiceBoy> | undefined> => {
   try {
      const _id = new Types.ObjectId(id)
      return this._serviceBoyRepository.loadProfile({ _id: _id });
   } catch (error) {
      throw error;
   }
  }


updateServiceBoyStatus = async (id:string, status:string):Promise<Partial<IServiceBoy> | undefined> => {
   try {
      if (!Types.ObjectId.isValid(id)) {
  throw new BadrequestError("Invalid ObjectId from serviceboy admin service");
}
      const isBlocked = status ==="block"
      const _id = new Types.ObjectId(id);
      logger.debug("created _id from id string",{_id})
     let result =  this._serviceBoyRepository.updateServiceBoy({_id},{isBlocked:isBlocked});
     logger.info("updateServiceBoyStatus result",{result});
      return
   } catch (error) {
throw error;
   }
}
}



