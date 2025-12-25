import { VerificationStatusType } from "../../../../constants/status"
import { ServiceBoyLoginDTO } from "../../../../dtos/v1/serviceBoy.dto"
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity"

export interface IServiceBoyService {
  updateProfile(
    data: Partial<IServiceBoy>,
    files: any
  ): Promise<IServiceBoy | undefined>
  

  LoadProfile (_id:Partial<IServiceBoy>):Promise<IServiceBoy | undefined> 
  retryVerification (_id:Partial<IServiceBoy>,isVerified:VerificationStatusType):Promise<IServiceBoy | undefined> 
  loadServiceBoyById (_id:Partial<IServiceBoy>):Promise<ServiceBoyLoginDTO | undefined>
}