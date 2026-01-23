import { Request, Response, NextFunction } from "express";

import { Role } from "../constants/Role";
import { ResponseMessage } from "../constants/resposnseMessage";
import { ForbiddenError } from "../utils/errors/forbidden.error";

export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
       throw new ForbiddenError(ResponseMessage.FORBIDDEN);
    }
    next();
  };
