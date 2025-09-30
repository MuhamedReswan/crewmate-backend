      import { Request } from 'express';
      import { JwtPayload } from "./type";

    declare global {
      namespace Express {
        interface Request {
          user?: JwtPayload ; 
        }
      }
    }