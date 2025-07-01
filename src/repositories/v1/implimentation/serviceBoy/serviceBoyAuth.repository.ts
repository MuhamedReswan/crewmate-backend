import { inject, injectable } from "tsyringe";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { serviceBoyModel } from "../../../../models/v1/serviceBoy.model";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { IServiceBoyAuthRepository } from "../../interfaces/serviceBoy/IServiceBoyAuth.repository"; 
import { Model } from "mongoose";
import { BaseRepository } from "../base/base.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import logger from "../../../../utils/logger.util";

@injectable()
export default class serviceBoyAuthRepository
  extends BaseRepository<IServiceBoy>
  implements IServiceBoyAuthRepository
{
     constructor(@inject('ServiceBoyModel')  model: Model<IServiceBoy>) {
    super(model);
  }


    async findServiceBoyByEmail(email: string): Promise<IServiceBoy | null>{
        try {
            logger.info(`Finding service boy by email: ${email}`)
            return await this.findOne({email});
        } catch (error) {
            throw error
        }
    };


async createServiceBoy(serviceBoyData: Partial<IServiceBoy>): Promise<IServiceBoy>{
    try {
    
        let serviceBoyDetails =  await this.create(serviceBoyData);
        logger.debug("serviceBoy created successfully", { serviceBoyDetails });
        return serviceBoyDetails;
    } catch (error) {
        throw error
    }
}


async updateServiceBoyPassword(email:string, password:string): Promise<void>  {
    try {
    const updatedServiceBoy =  await serviceBoyModel.findOneAndUpdate(
        {email},
        {password},
        );

 if(!updatedServiceBoy){
     logger.warn("Service boy not found during password update", { email });
throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
 }
    } catch (error) {
        throw error;
    }
};





}
