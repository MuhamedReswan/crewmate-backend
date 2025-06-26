import { JwtPayload } from "../types/type";
import { Request } from 'express';
console.log("JwtPayload-------------------------------",JwtPayload);
declare global {
  namespace Express {
    interface Request {
      user?:  { [key: string]: any };    }
  }
}

export {};