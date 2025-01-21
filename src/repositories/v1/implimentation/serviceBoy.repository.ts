import { IServiceBoyRepository } from "../interfaces/IServiceBoyRepository";
import serviceBoyModel from "../../../models/v1/serviceBoy.model";


export default class ServiceBoysRepository implements IServiceBoyRepository{

    async findServiceBoyByEmail(email: string): Promise<any>{
return await serviceBoyModel.findOne({email});
    }


async createServiceBoy(serviceBoyData: any): Promise<any>{
    console.log("createServiceBoy got");
    console.log("serviceBoyData",serviceBoyData);

    return await serviceBoyModel.create(serviceBoyData);
}

}
