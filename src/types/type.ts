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
| { role: Role.SERVICE_BOY; data: Partial<IServiceBoy> }
| { role: Role.ADMIN; data: Partial<IAdmin> }
| { role: Role.VENDOR; data: Partial<IVendor> };


// export type UploadedFile = {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   buffer: Buffer;
//   size: number;
// };


// export interface ImageFiles {
//   [key: string]: UploadedFile[];
// }


//  export type FormattedFiles = {
//   profileImage?: UploadedFile;
//   aadharImageFront?: UploadedFile;
//   aadharImageBack?: UploadedFile;
// };


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