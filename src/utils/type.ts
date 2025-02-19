import { NextFunction, Request, Response } from "express";
import IServiceBoy from "../entities/v1/serviceBoyEntity";
import IVendor from "../entities/v1/vendorEntity";
import IAdmin from "../entities/v1/adminEntity";

export type RequestHandler<
  TReturn = void
> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<TReturn>;

export type CreateToken = 
| { role: "ServiceBoy"; data: IServiceBoy }
| { role: "Admin"; data: IAdmin }
| { role: "Vendor"; data: IVendor };