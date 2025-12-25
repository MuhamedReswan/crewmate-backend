import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import IEvent from "../../../../entities/v1/eventEntity";
import { BaseRepository } from "../base/base.repository";
import logger from "../../../../utils/logger.util";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { EventQueryFilter } from "../../../../types/type";
import { IEventRepository } from "../../interfaces/event/IEvent.repository";



@injectable()
export default class EventRepository
  extends BaseRepository<IEvent>
  implements IEventRepository
{
  constructor(@inject("EventModel") model: Model<IEvent>) {
    super(model);
  }

  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    try {
      let eventDetails = await this.create(eventData);
      logger.debug("event created successfully", { eventDetails });
      return eventDetails;
    } catch (error) {
      throw error;
    }
  }

  async findEvent(data: Partial<IEvent>): Promise<IEvent | null> {
    try {
      let event = await this.findOne(data);
      return event;
    } catch (error) {
      throw error;
    }
  }

async findEventById(id: string): Promise<IEvent | null> {
  return this.findById(id);
}


  async findEventsPaginated(
    filter: EventQueryFilter,
    sort: Record<string, 1 | -1> = { reportingDateTime: -1 } 
  ): Promise<PaginatedResponse<IEvent>> {
    try {
      let baseFilter: Partial<IEvent>;
      if (filter.vendor) {
        baseFilter = {
          vendor: filter.vendor,
          ...(filter.status && { status: filter.status }),
        };
      } else {
        baseFilter = {
          ...(filter.status && { status: filter.status }),
        };
      }

      // Date range filter
      if (filter.from || filter.to) {
        (baseFilter as any).reportingDateTime = {};
        if (filter.from)
          (baseFilter as any).reportingDateTime.$gte = new Date(filter.from);
        if (filter.to)
          (baseFilter as any).reportingDateTime.$lte = new Date(filter.to);
      }

      const searchFields: (keyof IEvent)[] = ["customerName", "typeOfWork"];

      const { data, pagination } = await this.findPaginated(
        baseFilter,
        filter.page,
        filter.limit,
        filter.search,
        searchFields,
        sort
      );

      const populatedData = await this._model.populate(data, {
        path: "vendor",
        select: 'name email mobile _id'
      });

      return {
        data: populatedData,
        pagination,
      };
    } catch (error) {
      throw error;
    }
  }


    async updateEventById(  eventId: string, data: Partial<IEvent>): Promise<IEvent | undefined> {
    try {
      let event = await this.updateById(eventId, data);
      return event ?? undefined;
    } catch (error) {
      throw error;
    }
  }
}
