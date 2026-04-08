import { JwtPayload } from "jsonwebtoken";
import IEvent from "../../../../entities/v1/eventEntity";
import { PaginatedResponse } from "../../../../types/pagination.type";
import { eventFilter } from "../../../../types/type";

export interface IEventService {
  createEvent(eventData: Partial<IEvent>): Promise<IEvent | undefined>;

  getEvents(
  user: JwtPayload,
  query: eventFilter
  ): Promise<PaginatedResponse<IEvent> | undefined>;

   updateEvent (
    eventId: string,
    data:  Partial<IEvent>
  ): Promise <IEvent | undefined>
}