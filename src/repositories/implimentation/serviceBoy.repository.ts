import { IServiceBoyRepository } from "../interfaces/IServiceBoyRepository";
import serviceBoyModel from "../../models/serviceBoy.model";


export default class ServiceBoysRepository implements IServiceBoyRepository{

async createServiceBoy(serviceBoyData: any): Promise<any>{
    console.log("createServiceBoy got");
    console.log("serviceBoyData",serviceBoyData);

    return await serviceBoyModel.create(serviceBoyData);
}

}
