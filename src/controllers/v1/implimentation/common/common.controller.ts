import { inject, injectable } from "tsyringe";
import { ICommonService } from "../../../../services/v1/implimentation/common/common.service";
import { NextFunction, Request, Response } from "express";

import { RequestHandler } from "../../../../types/type";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { responseHandler } from "../../../../utils/responseHandler.util";
import logger from "../../../../utils/logger.util";

export interface ICommonController {
streamImageByKey:RequestHandler
}

@injectable()
export default class CommonController implements ICommonController {
  constructor(
    @inject("ICommonService") private commonService: ICommonService
  ) {}


  streamImageByKey = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    try{
      logger.info("req.params streamImageByKey", req.params);
        let {key} = req.params;
       let imageUrl = await this.commonService.streamImageByKey(key);

       if(imageUrl){
           res.status(200).json(responseHandler(ResponseMessage.IMAGE_URL_SUCCESS, HttpStatusCode.OK, imageUrl ));
       }else{
           res.status(400).json(responseHandler( ResponseMessage.IMAGE_URL_FAILED,HttpStatusCode.BAD_REQUEST));
       }

    }catch(error){
        next(error);
    }

  }

  }

