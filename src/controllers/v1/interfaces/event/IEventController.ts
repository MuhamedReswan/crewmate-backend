import { RequestHandler } from "../../../../types/type";

export interface IEventController {
  createEvent: RequestHandler;
  getEvents: RequestHandler;
  getWorks: RequestHandler;
  updateEvent: RequestHandler;
  changeBookingStatus: RequestHandler;
}