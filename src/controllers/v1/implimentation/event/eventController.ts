import { inject, injectable } from "tsyringe";
import { eventFilter, EventQueryFilter, RequestHandler } from "../../../../types/type";
import { IEventService } from "../../../../services/v1/implimentation/event/event.service";
import { NextFunction, Request, Response } from "express";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { Types } from "mongoose";


export interface IEventController{
    createEvent:RequestHandler
    getEvents:RequestHandler
}
@injectable()
export default class EventController implements IEventController{
    constructor(@inject("IEventService")private _eventService:IEventService){}

     createEvent = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            logger.info("req.body in createEvent ",{body:req.body});
          const event = this._eventService.createEvent(req.body);
          if(event){
              res.status(200).json(responseHandler(ResponseMessage.EVENT_CREATION_SUCCESS, HttpStatusCode.CREATED, event));
          }

        } catch (error) {
logger.error("eventController: createEvent error", error );
            next(error);
        }
    };

//      getEvents = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
//         try {
//             logger.info("req.params in getEvents ",{params: req.params});
//             logger.info("req.query in getEvents ",{query: req.query});
//             const { search ="", status, from, to, page = 1, limit = 10 } = req.query;

//   if (!req.params.vendorId) {
//              res.status(400).json({
//                 message: "vendorId is required",
//             });
//             return
//         }

//         const vendorId = new Types.ObjectId(req.params.vendorId);

//       const filter: eventFilter = {
//       vendorId,
//       search: String(search),
//       page: Number(page),
//       limit: Number(limit),
//       status: status ? String(status) : undefined,
//       from: from ? String(from) : undefined,
//       to: to ? String(to) : undefined,
//     };
    
//     const result = this._eventService.getEvents(filter);    
//     logger.debug("getEvents result",{result});
//     res.status(200).json(responseHandler(ResponseMessage.LOAD_EVENT_SUCCESS,HttpStatusCode.OK, result));   

//         } catch (error) {
// logger.error("eventController: createEvent error", error );
//             next(error);
//         }
//     };

//  async getEvents(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { search = "", status, from, to, page = 1, limit = 10, sortBy = "date", sortOrder = "desc" } = req.query;

//       if (!req.params.vendorId) return res.status(400).json({ message: "vendorId is required" });

//       const vendorId = new Types.ObjectId(req.params.vendorId);

//       const filter: EventQueryFilter = {
//         vendorId: vendorId.toHexString(),
//         search: String(search),
//         status: status ? String(status) : undefined,
//         from: from ? String(from) : undefined,
//         to: to ? String(to) : undefined,
//         page: Number(page),
//         limit: Number(limit)
//       };

//       const sort = { [String(sortBy)]: sortOrder === "asc" ? 1 : -1 };

//       const events = await this.getEvents(filter, ["customerName", "typeOfWork"], sort);
//       res.status(200).json(events);
//     } catch (error) {
//       next(error);
//     }
//   }


 getEvents = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    res.status(200).json(responseHandler(ResponseMessage.LOAD_EVENT_SUCCESS,HttpStatusCode.OK, {}))
 }
}