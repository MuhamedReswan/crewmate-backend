import { ErrorRequestHandler } from 'express';
import { CustomError } from '../utils/errors/custom.error';
import logger from '../utils/logger.util';

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
    logger.error("Unhandled error in request", { error: err });
  if (err instanceof CustomError) {
    res.status(err.statusCode).json(err.serializeErrors());
    return; 
  }
   res.status(500).json({ message: "Internal Server Error" });
};
