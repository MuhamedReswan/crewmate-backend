import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { serviceBoyModel } from "../../../../models/v1/serviceBoy.model";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { IServiceBoyAuthRepository } from "../../interfaces/serviceBoy/IServiceBoyAuth.repository"; 

export default class ServiceBoyAuthRepository implements IServiceBoyAuthRepository{

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
throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
 }
    } catch (error) {
        throw error
    }
};





}
