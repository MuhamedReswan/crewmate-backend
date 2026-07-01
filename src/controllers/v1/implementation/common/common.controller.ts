import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { ICommonService } from "../../../../services/v1/interfaces/common/ICommon.service";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ICommonController } from "../../interfaces/common/ICommon.controller";

@injectable()
export default class CommonController implements ICommonController {
  constructor(@inject("ICommonService") private commonService: ICommonService) {}

  streamImageByKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info("req.params streamImageByKey", req.params);
      const { key } = req.params;
      const imageUrl = await this.commonService.streamImageByKey(key);

      if (imageUrl) {
        res
          .status(HttpStatusCode.OK)
          .json(responseHandler(ResponseMessage.IMAGE_URL_SUCCESS, HttpStatusCode.OK, imageUrl));
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(responseHandler(ResponseMessage.IMAGE_URL_FAILED, HttpStatusCode.BAD_REQUEST));
      }
    } catch (error) {
      next(error);
    }
  };

  getSecureDocumentUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info("req.params publicId", req.params);
      const publicId = decodeURIComponent(req.params.publicId);
      const imageUrl = await this.commonService.getSecureDocumentUrl(publicId);

      if (imageUrl) {
        res
          .status(HttpStatusCode.OK)
          .json(responseHandler(ResponseMessage.IMAGE_URL_SUCCESS, HttpStatusCode.OK, imageUrl));
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(responseHandler(ResponseMessage.IMAGE_URL_FAILED, HttpStatusCode.BAD_REQUEST));
      }
    } catch (error) {
      next(error);
    }
  };
}
