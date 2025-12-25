import IEvent from "../../../../entities/v1/eventEntity";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { EventQueryFilter } from "../../../../types/type";

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