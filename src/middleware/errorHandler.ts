import { ErrorRequestHandler } from 'express';
import { CustomError } from '../utils/errors/custom.error';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//   console.error(err);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json(err.serializeErrors());
    return 
  }
   res.status(500).json({ message: "Something went wrong" });
};
