import { inject, injectable } from "tsyringe";
import { BaseRepository } from "../base/base.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { Model } from "mongoose";
import logger from "../../../../utils/logger.util";


export interface IServiceBoyRepository{
  updateProfile(id:Partial<IServiceBoy>, data: Partial<IServiceBoy>): Promise<IServiceBoy | undefined>
  loadProfile(id:Partial<IServiceBoy>): Promise<IServiceBoy | undefined>
}

@injectable()
export default class ServiceBoyRepository extends BaseRepository<IServiceBoy> implements IServiceBoyRepository{
     constructor(@inject('ServiceBoyModel')  model: Model<IServiceBoy>) {
    super(model);
  }

  async updateProfile(_id:Partial<IServiceBoy>,data: Partial<IServiceBoy>): Promise<IServiceBoy | undefined> {
    try {
   logger.debug("ID from ServiceBoyRepository.updateProfile", { _id });
  logger.debug("Profile update data", { data });

const updatedProfile = await this.updateOne(_id ,data);
logger.debug("Updated profile", { updatedProfile });

      if(updatedProfile){
        return updatedProfile;
      }
      return;
    } catch (error) {
      throw error;
    }
  }

async loadProfile(_id:Partial<IServiceBoy>): Promise<IServiceBoy | undefined>{
  try{
const serviceBoyProfile = await  this.findOne(_id);

logger.debug("serviceBoyProfile", { serviceBoyProfile });

if(serviceBoyProfile) return serviceBoyProfile;
return;

   } catch (error) {
      throw error;
    }
  
}
  
}