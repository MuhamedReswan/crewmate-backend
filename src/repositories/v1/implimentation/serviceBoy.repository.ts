import { ResponseMessage } from "../../../enums/resposnseMessage";
import { serviceBoyModel } from "../../../models/v1/serviceBoy.model";
import { NotFoundError } from "../../../utils/errors/notFound.error";
import { IServiceBoyRepository } from "../interfaces/IServiceBoyRepository";

export default class ServiceBoysRepository implements IServiceBoyRepository{

    async findServiceBoyByEmail(email: string): Promise<any>{
        try {
            return await serviceBoyModel.findOne({email});
        } catch (error) {
            console.log(error);
            throw error
        }
    }


async createServiceBoy(serviceBoyData: any): Promise<any>{
    try {
        console.log("createServiceBoy got");
        console.log("serviceBoyData",serviceBoyData);
    
        let serviceBoyDetails =  await serviceBoyModel.create(serviceBoyData);
        console.log("serviceBoyDetails",serviceBoyDetails)
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
throw new NotFoundError(ResponseMessage.SERVICE_BOY_NOTFOUND);
 }
    } catch (error) {
        throw error
    }
};





}
