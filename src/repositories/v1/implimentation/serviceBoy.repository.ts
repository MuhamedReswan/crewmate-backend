import { IServiceBoyRepository } from "../interfaces/IServiceBoyRepository";
import serviceBoyModel from "../../../models/v1/serviceBoy.model";

export default class ServiceBoysRepository implements IServiceBoyRepository{

    async findServiceBoyByEmail(email: string): Promise<any>{
        try {
            return await serviceBoyModel.findOne({email});
        } catch (error) {
            console.log(error);
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
    }

}

}
