import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import IEvent from "../../../../entities/v1/eventEntity";
import { BaseRepository } from "../base/base.repository";
import logger from "../../../../utils/logger.util";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { EventQueryFilter, SortOption } from "../../../../types/type";

export interface IEventRepository {
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  findEvent(data: Partial<IEvent>): Promise<IEvent | null>;
  // findEvents(filter: any, page: number, limit: number, search:string): Promise<PaginatedResponse<IEvent> | undefined>
//  findEvents(
//     filter: EventQueryFilter,
//     searchFields?: (keyof IEvent)[],
//     sort?: SortOption<IEvent>
//   ): Promise<PaginatedResponse<IEvent>>
}

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

// async findEvents(filter: Partial<IEvent> & { search?: string; page: number; limit: number }, page: number, limit: number, search:string): Promise<PaginatedResponse<IEvent>| undefined> {
//   try {

//     return this.findPaginated(filter,page,limit,search, ["customerName", "typeOfWork"] );
//   } catch (error) {
//      throw error;
//   }
//   }




// async findEvents(filter:EventQueryFilter, 
//   /* page: number, limit: number, search:string*/ 
//   searchFields: (keyof IEvent)[] = ["customerName", "typeOfWork"],
//   sort?: { [key: string]: 1 | -1 }
// ): Promise<PaginatedResponse<IEvent>| undefined> {
//   try {

//     return this.findPaginated(filter,page,limit,search, ["customerName", "typeOfWork"] );
//   } catch (error) {
//      throw error;
//   }
//   }


//   async findEvents(
//     filter: EventQueryFilter,
//     searchFields: (keyof IEvent)[] = ["customerName", "typeOfWork"],
//     sort?: SortOption<IEvent>
//   ): Promise<PaginatedResponse<IEvent>> {
//     const baseFilter: Partial<IEvent> = {
//       vendorId: filter.vendorId,
//       ...(filter.status && { status: filter.status })
//     };

//     // Date range filter
//     if (filter.from || filter.to) {
//       (baseFilter as any).date = {};
//       if (filter.from) (baseFilter as any).date.$gte = new Date(filter.from);
//       if (filter.to) (baseFilter as any).date.$lte = new Date(filter.to);
//     }

//     return this.findPaginated(
//       baseFilter,
//       filter.page,
//       filter.limit,
//       filter.search,
//       searchFields,
//       sort
//     );
  
// }
}
