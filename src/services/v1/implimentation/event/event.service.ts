import { inject, injectable } from "tsyringe";
import { IEventRepository } from "../../../../repositories/v1/implimentation/event/event.repository";
import IEvent from "../../../../entities/v1/eventEntity";
import { Types } from "mongoose";
import logger from "../../../../utils/logger.util";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { ConflictError } from "../../../../utils/errors/conflict.error";
import { IVendorRepository } from "../../../../repositories/v1/implimentation/vendor/vendor.repository";
import { eventFilter, EventQueryFilter, SortOption } from "../../../../types/type";
import { PaginatedResponse } from "../../../../types/pagination.type";

export interface IEventService {
  createEvent(eventData: Partial<IEvent>): Promise<IEvent | undefined>;

getEvents( filter: EventQueryFilter,sort: Record<string, 1 | -1>)
: Promise<PaginatedResponse<IEvent>| undefined>
}

@injectable()
export default class EventService implements IEventService {
  constructor(
    @inject("IEventRepository") private _eventRepository: IEventRepository,
    @inject("IVendorRepository") private _vendorRepository: IVendorRepository
  ) {}

  async createEvent(eventData: Partial<IEvent>): Promise<IEvent | undefined> {
    try {
      const vendorId = new Types.ObjectId(eventData.vendorId);

      const vendor = await this._vendorRepository.findVendor({ _id: vendorId });
          logger.debug("vendor form event service", vendor);
      if (!vendor) {
        throw new BadrequestError(ResponseMessage.VENDOR_NOT_EXIST);
      }

      eventData.vendorId = vendorId;
      const existingEvent = await this._eventRepository.findEvent(eventData);
          logger.debug("existingEvent form event service", existingEvent);
      if (existingEvent) {
        throw new ConflictError(ResponseMessage.EVENT_ALREADY_EXIST);
      }

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

}
