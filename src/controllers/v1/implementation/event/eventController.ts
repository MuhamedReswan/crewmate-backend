import { inject, injectable } from "tsyringe";
import {
  EventQueryFilter,
} from "../../../../types/type";
import { NextFunction, Request, Response } from "express";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { Types } from "mongoose";
import { EventStatusType } from "../../../../constants/status";
import { IEventController } from "../../interfaces/event/IEventController";
import { IEventService } from "../../../../services/v1/interfaces/event/IEvent.service";



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
    const status = (req.query.status as EventStatusType) || undefined;
    const from = (req.query.from as string) || undefined;
    const to = (req.query.to as string) || undefined;
    const sortBy = (req.query.sortBy as string) || "reportingDateTime";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    if (!req.params.vendorId) {
      res.status(400)
      .json(
       responseHandler(
          ResponseMessage.VENDOR_ID_MISSING,
          HttpStatusCode.BAD_REQUEST,
        )
      );
      return;
    }

    const vendor = new Types.ObjectId(req.params.vendorId);
    
    const filter: EventQueryFilter = {
      vendor,
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
          ResponseMessage.LOAD_EVENT_SUCCESS,
          HttpStatusCode.OK,
          events
        )
      );
  } catch (error) {
    logger.error("getEvents on event controller", error);
    next(error);
  }
};


getWorks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
        logger.debug("getWorks req.query",req.query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as EventStatusType) || undefined;
    const from = (req.query.from as string) || undefined;
    const to = (req.query.to as string) || undefined;
    const sortBy = (req.query.sortBy as string) || "reportingDateTime";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    // if (!req.params.vendorId) {
    //   res.status(400).json({ message: "vendorId is required" });
    //   return;
    // }

    // const vendorId = new Types.ObjectId(req.params.vendorId);
    
    const filter: EventQueryFilter = {
      search,
      status,
      from,
      to,
      page,
      limit
    };

    
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const works = await this._eventService.getEvents(filter,sort);
    logger.debug("getWorks out in controller",{works})

    res
      .status(200)
      .json(
        responseHandler(
          ResponseMessage.LOAD_WORKS_SUCCESS,
          HttpStatusCode.OK,
          works
        )
      );
  } catch (error) {
    next(error);
  }
};



updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
     const updateData = req.body;
     const updatedEvent = await this._eventService.updateEvent(eventId, updateData);
        
      if (!updatedEvent) {
       res.status(404).json({
        message: ResponseMessage.EVENT_NOT_FOUND,
      });
    }

     res.status(200).json({
      message:ResponseMessage.EVENT_UPDATION_SUCCESS,
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

changeBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
     const bookingStatus = req.body;
     logger.debug("changeBookingStatus out in controller",{bookingStatus})
     const bookingUpdatedEvent = await this._eventService.updateEvent(eventId, bookingStatus);
        
      if (!bookingUpdatedEvent) {
       res.status(404).json({
        message: ResponseMessage.EVENT_NOT_FOUND,
      });
    }

     res.status(200).json({
      message: ResponseMessage.BOOKING_STATUS_UPDATED ,
      data: bookingUpdatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

}
