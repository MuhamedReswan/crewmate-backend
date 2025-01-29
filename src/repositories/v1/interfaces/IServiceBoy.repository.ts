import { Register } from "../../../entities/v1/authenticationEntity";

export interface IServiceBoyRepository{
    findServiceBoyByEmail(email:string):Promise<any>;
    createServiceBoy(serviceBoyData:Register):Promise<any>;
    updateServiceBoyPassword(email:string, password:string): Promise<void>


}