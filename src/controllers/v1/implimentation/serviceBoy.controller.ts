import { Request, Response } from "express";
import { IServiceBoyService } from "../../../services/v1/interfaces/IServiceBoyService";
import { IServiceBoyController } from "../interfaces/IServiceBoyController";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../utils/httpStatusCode";



@injectable()
export default class ServiceBoyController implements IServiceBoyController {
    private serviceBoyService: IServiceBoyService;

    constructor(@inject('IServiceBoyService') serviceBoyService: IServiceBoyService){
        this.serviceBoyService = serviceBoyService;
    }


    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, mobile } = req.body;
            console.log("req.boyd",req.body);
             await this.serviceBoyService.register( name, email, password, mobile );
             await this.serviceBoyService.generateOTP(email);
            res.status(HttpStatusCode.CREATED).json({message: 'User resgistered successfully'});
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message: 'Internal Server Error'});
        }
    }


    // async generateOTP(req: Request, res: Response): Promise<void>{
        
    // }
}