import { Request, Response } from "express";
import { IServiceBoyService } from "../../services/interfaces/IServiceBoyService";
import { IServiceBoyController } from "../interfaces/IServiceBoyController";
import { inject, injectable } from "tsyringe";



@injectable()
export default class ServiceBoyController implements IServiceBoyController {
    private serviceBoyService: IServiceBoyService;

    constructor(@inject('IServiceBoyService') serviceBoyService: IServiceBoyService){
        this.serviceBoyService = serviceBoyService;
    }


    async register(req: Request, res: Response): Promise<void> {
        try {
            
        } catch (error) {
            
        }
    }
}