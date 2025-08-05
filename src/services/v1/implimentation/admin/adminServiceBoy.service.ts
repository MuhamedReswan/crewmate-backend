import { inject, injectable } from "tsyringe";
import { IServiceBoyRepository } from "../../../../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { Types } from "mongoose";
import { VerificationStatusType } from "../../../../constants/verificationStatus";



export interface IAdminServiceBoyService{
loadAllPendingVerification():Promise<Partial<IServiceBoy>[] | undefined>
verifyServiceBoy(id:string, status:VerificationStatusType):Promise<Partial<IServiceBoy> | undefined>
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
}