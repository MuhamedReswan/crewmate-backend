import { ErrorRequestHandler } from 'express';
import { CustomError } from '../utils/errors/custom.error';
import logger from '../utils/logger.util';
import { ResponseMessage } from '../constants/resposnseMessage';
import { responseHandler } from '../utils/responseHandler.util';
import { HttpStatusCode } from '../constants/httpStatusCode';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error("Unhandled error in request", { error: err });
  // Known / operational errors
  if (err instanceof CustomError) {
    const serialized = err.serializeErrors();

     res
      .status(err.statusCode)
      .json( 
        responseHandler(
          serialized.message,
          err.statusCode,
          { name: serialized.name }
        )
      );
      return;
  }

  // Unknown errors
   res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json(
      responseHandler(
        ResponseMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    );
};
