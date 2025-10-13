import { NextFunction, Request, Response } from "express";
import IServiceBoy from "../entities/v1/serviceBoyEntity";
import IVendor from "../entities/v1/vendorEntity";
import IAdmin from "../entities/v1/adminEntity";
import { Role } from "../constants/Role";
import { ObjectId, Types } from "mongoose";
import IEvent from "../entities/v1/eventEntity";

export type RequestHandler<
  TReturn = void
> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<TReturn>;

export type CreateToken = 
| { role: Role.SERVICE_BOY; data: Partial<IServiceBoy> }
| { role: Role.ADMIN; data: Partial<IAdmin> }
| { role: Role.VENDOR; data: Partial<IVendor> };



export interface FileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface ImageFiles {
  profileImage?: FileData[];
  aadharImageFront?: FileData[];
  aadharImageBack?: FileData[];
  licenceImage?: FileData[];
}




export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}


export interface LocationData {
  lat: number;
  lng: number;    
  address: string;
}

export interface eventFilter {
  vendorId:Types.ObjectId
  search :string;
  limit : number
  page : number,
  status?:string,
  from ?:string,
  to ?: string,
}

export type SortOption<T> = Partial<Record<keyof T, 1 | -1>>;

export interface EventQueryFilter extends Partial<IEvent> {
  vendorId: Types.ObjectId;
  search?: string;
  status?: string;
  from?: string;
  to?: string;   
  page: number;
  limit: number;
  
}
