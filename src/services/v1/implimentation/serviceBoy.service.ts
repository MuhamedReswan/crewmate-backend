import { IServiceBoyRepository } from "../../../repositories/v1/interfaces/IServiceBoyRepository";
import { IServiceBoyService } from "../interfaces/IServiceBoyService";
import { injectable,inject } from "tsyringe";


@injectable()
export default class ServiceBoyService implements IServiceBoyService{
    private serviceBoyRepository: IServiceBoyRepository;

    constructor(@inject("IServiceBoyRepository") serviceBoyRepository: IServiceBoyRepository){
        this.serviceBoyRepository = serviceBoyRepository;
    }

    async async register(name: string, email: string, password: string, mobile: string): Promise<void> {
        console.log("ServiceBoyServie register got");
        console.log("name",name);
        console.log("email",email);
        console.log("password",password);
        console.log("mobile",mobile);
    }



}