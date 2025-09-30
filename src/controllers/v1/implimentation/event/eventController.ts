import { inject, injectable } from "tsyringe";
import { RequestHandler } from "../../../../types/type";
import { IEventService } from "../../../../services/v1/implimentation/event/event.service";
import { NextFunction, Request, Response } from "express";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";


export interface IEventController{
    createEvent:RequestHandler
}
@injectable()
export default class EventController implements IEventController{
    constructor(@inject("IEventService")private _eventService:IEventService){}

     createEvent = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            logger.info("req.body in createEvent ",req.body);
          const event = this._eventService.createEvent(req.body);
          if(event){
              res.status(200).json(responseHandler(ResponseMessage.EVENT_CREATION_SUCCESS, HttpStatusCode.CREATED, event));
          }

        } catch (error) {
logger.error("eventController: createEvent error", error );
            next(error);
        }
    };
}