import { NextFunction, Request, Response } from "express";
import { IServiceBoyLoginResponse } from "../services/v1/interfaces/IServiceBoyService";
import { IVendorLoginResponse } from "../services/v1/interfaces/vendor/IVendorAuthService";
import IServiceBoy from "../entities/v1/serviceBoyEntity";
import IVendor from "../entities/v1/vendorEntity";

export type RequestHandler<
  TReturn = void
> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<TReturn>;

export type CreateToken = 
| { role: "Service Boy"; data: IServiceBoy }
| { role: "Vendor"; data: IVendor };