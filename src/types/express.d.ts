import { JwtPayload } from "../types/type";
console.log("JwtPayload-------------------------------",JwtPayload);
declare global {
  namespace Express {
    interface Request {
      user?:  { [key: string]: any };    }
  }
}

export {};