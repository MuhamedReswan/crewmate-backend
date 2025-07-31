import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { IBaseRepository } from "../base/IBase.repository";

export interface IServiceBoyAuthRepository extends IBaseRepository<IServiceBoy>{
    findServiceBoyByEmail(email:string):Promise<IServiceBoy | null>;
    createServiceBoy(serviceBoyData:Partial<IServiceBoy>):Promise<IServiceBoy>;
    updateServiceBoyPassword(email:string, password:string): Promise<void>


}