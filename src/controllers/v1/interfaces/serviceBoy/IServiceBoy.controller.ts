import { RequestHandler } from "../../../../types/type";

export interface IServiceBoyController {
  loadProfile: RequestHandler;
  updateProfile: RequestHandler;
  retryServiceBoyVerfication: RequestHandler;
  loadServiceBoyById: RequestHandler;
}