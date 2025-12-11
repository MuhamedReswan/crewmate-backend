import { inject, injectable } from "tsyringe";
import { IEventRepository } from "../../../../repositories/v1/implimentation/event/event.repository";
import IEvent from "../../../../entities/v1/eventEntity";
import { Types } from "mongoose";
import logger from "../../../../utils/logger.util";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { ConflictError } from "../../../../utils/errors/conflict.error";
import { IVendorRepository } from "../../../../repositories/v1/implimentation/vendor/vendor.repository";
import {
  eventFilter,
  EventQueryFilter,
  SortOption,
} from "../../../../types/type";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { IAdminSystemSettingsService } from "../admin/adminSystemSettings.service";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { calculateTotalEventBill } from "../../../../utils/billCalculation.util";

export interface IEventService {
  createEvent(eventData: Partial<IEvent>): Promise<IEvent | undefined>;

  getEvents(
    filter: EventQueryFilter,
    sort: Record<string, 1 | -1>
  ): Promise<PaginatedResponse<IEvent> | undefined>;

   updateEvent (
    eventId: string,
    data:  Partial<IEvent>
  ): Promise <IEvent | undefined>
}

@injectable()
export default class EventService implements IEventService {
  constructor(
    @inject("IEventRepository") private _eventRepository: IEventRepository,
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository,
    @inject("IAdminSystemSettingsService")
    private _systemSettingsService: IAdminSystemSettingsService
  ) {}

  // async createEvent(eventData: Partial<IEvent>): Promise<IEvent | undefined> {
  //   try {
  //     const vendor = new Types.ObjectId(eventData.vendor);

  //     const vendorData = await this._vendorRepository.findVendor({
  //       _id: vendor,
  //     });
  //     logger.debug("vendor form event service", vendorData);
  //     if (!vendorData) {
  //       throw new BadrequestError(ResponseMessage.VENDOR_NOT_EXIST);
  //     }

  //     eventData.vendor = vendor;
  //     const existingEvent = await this._eventRepository.findEvent(eventData);
  //     logger.debug("existingEvent form event service", existingEvent);
  //     if (existingEvent) {
  //       throw new ConflictError(ResponseMessage.EVENT_ALREADY_EXIST);
  //     }

  //     const createdEvent = await this._eventRepository.createEvent(eventData);

  //     if (!createdEvent) {
  //       throw new BadrequestError(ResponseMessage.EVENT_NOT_CREATED);
  //     }
  //     return createdEvent;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

    async createEvent(eventData: Partial<IEvent>): Promise<IEvent | undefined> {
    try {
      const vendor = new Types.ObjectId(eventData.vendor);
      const vendorData = await this._vendorRepository.findVendor({ _id: vendor });

      if (!vendorData) {
        throw new BadrequestError(ResponseMessage.VENDOR_NOT_EXIST);
      }

      eventData.vendor = vendor;

      const existingEvent = await this._eventRepository.findEvent(eventData);
      if (existingEvent) {
        throw new ConflictError(ResponseMessage.EVENT_ALREADY_EXIST);
      }

// Fetch wage from System Settings
const settings = await this._systemSettingsService.getSettings();
if (!settings) {
  throw new BadrequestError("System settings are not configured");
}

const wage = Number(settings.wagePerBoy);
eventData.wagePerBoy = wage;

// Calculate totalBill safely
const boys = Number(eventData.serviceBoys ?? 0);
const bonus = Number(eventData.bonus ?? 0);
const overtime = Number(eventData.overTime ?? 0);
const travel = Number(eventData.travelExpense ?? 0);

eventData.totalBill = calculateTotalEventBill(boys, wage,bonus, overtime, travel );


      // Create event
      const createdEvent = await this._eventRepository.createEvent(eventData);

      if (!createdEvent) {
        throw new BadrequestError(ResponseMessage.EVENT_NOT_CREATED);
      }

      return createdEvent;
    } catch (error) {
      throw error;
    }
  }

  getEvents = async (
    filter: EventQueryFilter,
    sort: Record<string, 1 | -1> = { reportingDateTime: -1 }
  ): Promise<PaginatedResponse<IEvent> | undefined> => {
    try {
      return this._eventRepository.findEventsPaginated(filter, sort);
    } catch (error) {
      throw error;
    }
  };

  getWorks = async (
    filter: EventQueryFilter,
    sort: Record<string, 1 | -1> = { reportingDateTime: -1 }
  ): Promise<PaginatedResponse<IEvent> | undefined> => {
    try {
      logger.debug("getWorks filter", filter);
      return this._eventRepository.findEventsPaginated(filter, sort);
    } catch (error) {
      throw error;
    }
  };

  updateEvent = async (
    eventId: string,
    data:  Partial<IEvent>
  ): Promise <IEvent | undefined> => {
    try {
      logger.debug("getWorks filter", eventId);

      if(data.bonus || data.overTime|| data.travelExpense || data.serviceBoys  ){
        const event = await this._eventRepository.findEventById(eventId);
        if(!event) throw new NotFoundError(ResponseMessage.EVENT_NOT_FOUND);

const boys = Number(data.serviceBoys ?? event.serviceBoys);
const bonus = Number(data.bonus ?? event.bonus);
const overtime = Number(data.overTime ?? event.overTime);
const travel = Number(data.travelExpense ?? event.travelExpense);
const wage = Number(event.wagePerBoy);

        data.totalBill = calculateTotalEventBill(boys, wage,bonus, overtime, travel );
      }

  const updatedEvent = await this._eventRepository.updateEventById(eventId, data);

    return updatedEvent ?? undefined;  
    } catch (error) {
      throw error;
    }
  };


}
