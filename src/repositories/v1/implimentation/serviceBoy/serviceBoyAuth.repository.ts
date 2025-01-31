import { inject, injectable } from "tsyringe";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { serviceBoyModel } from "../../../../models/v1/serviceBoy.model";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { IServiceBoyAuthRepository } from "../../interfaces/serviceBoy/IServiceBoyAuth.repository"; 
import { Model } from "mongoose";
import { BaseRepository } from "../base/base.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";

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
            return await this.findOne({email});
        } catch (error) {
            console.log(error);
            throw error
        }
    };


async createServiceBoy(serviceBoyData: any): Promise<boolean | null>{
    try {
        console.log("createServiceBoy got");
        console.log("serviceBoyData",serviceBoyData);
    
        // let serviceBoyDetails =  await serviceBoyModel.create(serviceBoyData);
        let serviceBoyDetails =  await this.create(serviceBoyData);
        console.log("serviceBoyDetails",serviceBoyDetails);
        return true;
    } catch (error) {
        console.log("error from createServiceBoy repository",error)
        throw error
    }
}


async updateServiceBoyPassword(email:string, password:string): Promise<void>  {
    try {
    const updatedServiceBoy =  await serviceBoyModel.findOneAndUpdate(
        {email},
        {password},
         {new:true}
        );

 if(!updatedServiceBoy){
throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
 }
    } catch (error) {
        throw error
    }
};





}
