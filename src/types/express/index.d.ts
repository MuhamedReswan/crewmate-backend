
import { JwtPayload } from "../type";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export {};