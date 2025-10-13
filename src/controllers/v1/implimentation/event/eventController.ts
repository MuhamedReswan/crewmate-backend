import { inject, injectable } from "tsyringe";
import {
  EventQueryFilter,
  RequestHandler,
} from "../../../../types/type";
import { IEventService } from "../../../../services/v1/implimentation/event/event.service";
import { NextFunction, Request, Response } from "express";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { Types } from "mongoose";


export interface IEventController {
  createEvent: RequestHandler;
  getEvents: RequestHandler;
}
@injectable()
export default class EventController implements IEventController {
  constructor(@inject("IEventService") private _eventService: IEventService) {}


  createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
          logger.info("req.body in createEvent ",{body:req.body});
      const { date, reportingTime, ...rest } = req.body;
      const reportingDateTime = new Date(`${date}T${reportingTime}:00`);
      logger.debug("createEvent createEvent",{reportingDateTime})
      
      const event = await this._eventService.createEvent({
        ...rest,
        reportingDateTime,
      });

      if (event) {
        res
          .status(200)
          .json(
            responseHandler(
              ResponseMessage.EVENT_CREATION_SUCCESS,
              HttpStatusCode.CREATED,
              event
            )
          );
      }
    } catch (error) {
      logger.error("eventController: createEvent error", error);
      next(error);
    }
  };


getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || undefined;
    const from = (req.query.from as string) || undefined;
    const to = (req.query.to as string) || undefined;
    const sortBy = (req.query.sortBy as string) || "reportingDateTime";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    if (!req.params.vendorId) {
      res.status(400).json({ message: "vendorId is required" });
      return;
    }

    const vendorId = new Types.ObjectId(req.params.vendorId);
    
    const filter: EventQueryFilter = {
      vendorId,
      search,
      status,
      from,
      to,
      page,
      limit
    };

    
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const events = await this._eventService.getEvents(filter,sort);
    logger.debug("getEvents out in controller",{events})

    res
      .status(200)
      .json(
        responseHandler(
          "Events loaded successfully",
          HttpStatusCode.OK,
          events
        )
      );
  } catch (error) {
    next(error);
  }
};

}
