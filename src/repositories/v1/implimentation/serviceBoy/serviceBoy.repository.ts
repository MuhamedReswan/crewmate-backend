import { inject, injectable } from "tsyringe";
import { FilterQuery, Model } from "mongoose";
import { BaseRepository } from "../base/base.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import logger from "../../../../utils/logger.util";
import { VerificationStatus } from "../../../../constants/verificationStatus";
import { PaginatedResponse } from "../../../../types/pagination.type";


export interface IServiceBoyRepository{
  updateServiceBoy(id:Partial<IServiceBoy>, data: Partial<IServiceBoy>): Promise<IServiceBoy | undefined>
  loadProfile(id:Partial<IServiceBoy>): Promise<IServiceBoy | undefined>
  loadAllSBPendingVerification(): Promise<IServiceBoy[] | undefined>
  findServiceBoysPaginated(page: number, limit: number, search: string, isBlocked:boolean|undefined):Promise<PaginatedResponse<IServiceBoy>|undefined>
}

@injectable()
export default class ServiceBoyRepository extends BaseRepository<IServiceBoy> implements IServiceBoyRepository{
     constructor(@inject('ServiceBoyModel')  model: Model<IServiceBoy>) {
    super(model);
  }

  async updateServiceBoy(_id:Partial<IServiceBoy>,data: Partial<IServiceBoy>): Promise<IServiceBoy | undefined> {
    try {
   logger.debug("ID from ServiceBoyRepository.updateServiceBoy", { _id });
  logger.debug("ServiceBoy update data", { data });

const updatedServiceBoy = await this.updateOne(_id ,data);
logger.debug("Updated profile", { updatedServiceBoy });

      if(updatedServiceBoy){
        return updatedServiceBoy;
      }
      return;
    } catch (error) {
      throw error;
    }
  }

async loadProfile(data:Partial<IServiceBoy>): Promise<IServiceBoy | undefined>{
  try{
const serviceBoyProfile = await  this.findOne(data);

logger.debug("serviceBoyProfile", { serviceBoyProfile });

if(serviceBoyProfile) return serviceBoyProfile;
return;

   } catch (error) {
      throw error;
    }
}

async loadAllSBPendingVerification(): Promise<IServiceBoy[] | undefined>{
  try {
    const query: FilterQuery<IServiceBoy> = {
  isVerified: VerificationStatus.Pending,
  mobile: { $exists: true },
  age: { $exists: true }
};
    const pendingVerifications = await this.findAll(query);
    logger.info("pendingVerifications-- ServiceBoyRepository",{pendingVerifications});
    if(pendingVerifications) return pendingVerifications;
    return;
    
  } catch (error) {
    throw error;
  }
}

  async findServiceBoysPaginated(page: number, limit: number, search: string, isBlocked:boolean)
  :Promise<PaginatedResponse<IServiceBoy>|undefined> {
    try {
      return this.findPaginated(page, limit,  search, isBlocked, ["name", "email", "mobile"]);
    } catch (error) {
      throw error;
    }
  }
  
}