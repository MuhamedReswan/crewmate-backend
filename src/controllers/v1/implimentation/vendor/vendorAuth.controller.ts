import { NextFunction, Request, response, Response } from "express";
import { IVendorAuthController } from "../../interfaces/vendor/IVendorAuthController";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../enums/resposnseMessage";
import { IVendorAuthService } from "../../../../services/v1/interfaces/vendor/IVendorAuthService";

@injectable()
export default class VendorAuthController implements IVendorAuthController{

    constructor(@inject('IVendorAuthService') private vendorAuthService: IVendorAuthService) {}



    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password, mobile } = req.body;
            console.log("req.body register controller",req.body);
             await this.vendorAuthService.register( name, email, password, mobile );
             await this.vendorAuthService.generateOTP(email);
            res
            .status(HttpStatusCode.OK)
            .json(responseHandler(ResponseMessage.REGISTER_SUCCESS,HttpStatusCode.OK));
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message: 'Internal Server Error'});
        }
    }

}