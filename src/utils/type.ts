import { NextFunction, Request, Response } from "express";
import IServiceBoy from "../entities/v1/serviceBoyEntity";
import IVendor from "../entities/v1/vendorEntity";
import IAdmin from "../entities/v1/adminEntity";
import { Role } from "../constants/Role";

export type RequestHandler<
  TReturn = void
> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<TReturn>;

export type CreateToken = 
| { role: Role.SERVICE_BOY; data: IServiceBoy }
| { role: Role.ADMIN; data: IAdmin }
| { role: Role.VENDOR; data: IVendor };