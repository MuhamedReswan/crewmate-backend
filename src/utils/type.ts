import { NextFunction, Request, Response } from "express";

export type RequestHandler<
  TReturn = void
> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<TReturn>;