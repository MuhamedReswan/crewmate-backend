import { ErrorRequestHandler } from "express";

import { HttpStatusCode } from "../constants/httpStatusCode";
import { ResponseMessage } from "../constants/resposnseMessage";
import { CustomError } from "../utils/errors/custom.error";
import logger from "../utils/logger.util";
import { responseHandler } from "../utils/responseHandler.util";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // logger.error("Unhandled error in request", { error: err });

  logger.error("Unhandled error in request", {
    message: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  });

  // Known / operational errors
  if (err instanceof CustomError) {
    const serialized = err.serializeErrors();

    res
      .status(err.statusCode)
      .json(responseHandler(serialized.message, err.statusCode, { name: serialized.name }));
    return;
  }

  // Unknown errors
  res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json(
      responseHandler(ResponseMessage.INTERNAL_SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    );
};
