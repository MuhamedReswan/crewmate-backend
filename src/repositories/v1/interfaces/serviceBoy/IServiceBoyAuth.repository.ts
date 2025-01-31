import { Register } from "../../../../entities/v1/authenticationEntity";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IServiceBoyAuthRepository extends IBaseRepository<IServiceBoy>{
    findServiceBoyByEmail(email:string):Promise<IServiceBoy | null>;
    createServiceBoy(serviceBoyData:Register):Promise<boolean | null>;
    updateServiceBoyPassword(email:string, password:string): Promise<void>


}