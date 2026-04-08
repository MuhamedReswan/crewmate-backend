import { Request, Response, NextFunction } from "express";

import { Role } from "../constants/Role";
import { ResponseMessage } from "../constants/resposnseMessage";
import { ForbiddenError } from "../utils/errors/forbidden.error";
import logger from "../utils/logger.util";

export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("req.user from authorize middleware",req.user);
    if (!req.user || !allowedRoles.includes(req.user.role)) {
       throw new ForbiddenError(ResponseMessage.FORBIDDEN);
    }
    next();
  };
