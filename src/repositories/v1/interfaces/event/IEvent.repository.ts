import IEvent from "../../../../entities/v1/eventEntity";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { EventQueryFilter } from "../../../../types/type";

export interface IEventRepository {
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  findEvent(data: Partial<IEvent>): Promise<IEvent | null>;
  findEventsPaginated(
    filter: EventQueryFilter,
    sort?: Record<string, 1 | -1>
  ): Promise<PaginatedResponse<IEvent>>;
  updateEventById(  eventId: string, data: Partial<IEvent>): Promise<IEvent | undefined>
  findEventById(id: string): Promise<IEvent | null>
}