import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import IEvent from "../../../../entities/v1/eventEntity";
import { BaseRepository } from "../base/base.repository";
import logger from "../../../../utils/logger.util";

export interface IEventRepository {
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  // findVendor(_id: Partial<IEvent>): Promise<IEvent | null>
  findEvent(data: Partial<IEvent>): Promise<IEvent | null>;
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

}
