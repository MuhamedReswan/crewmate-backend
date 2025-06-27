import z, {ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../constants/httpStatusCode';
import { ValidationError } from '../utils/errors/validation.error';
import { ResponseMessage } from '../constants/resposnseMessage';
import logger from '../utils/logger.util';

function requestBodyValidator(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Validating request body");
            schema.parse(req.body);
            next();
        } catch (error) {
            logger.error("Zod validation error (body):", error);
           if (error instanceof z.ZodError) {
            const err =  error.errors.map((e:any) => ({
                field: e.path.join('.'),
                message: e.message,
              }))
            
              res.json({
                 status: HttpStatusCode.BAD_REQUEST,
                 message: ResponseMessage.VALIDATION_FAILED,
                 error: err
              })              
           }
                 logger.error("Unexpected error during body validation:", error);
           throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}


function requestQueryValidator(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Validating request query");
            schema.parse(req.query);
            next();
        } catch (error) {
      logger.error("Zod validation error (query):", error);
           if (error instanceof z.ZodError) {
            const err =  error.errors.map((e:any) => ({
                field: e.path.join('.'),
                message: e.message,
              }))
            
              res.json({
                 status: HttpStatusCode.BAD_REQUEST,
                 message: ResponseMessage.VALIDATION_FAILED,
                 error: err
              })              
           }
                 logger.error("Unexpected error during query validation:", error);
           throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}


function requestParamsValidator(schema: ZodSchema) {
    return (req:Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Validating request params");
            schema.parse(req.params);
            next();
        } catch (error) {
            logger.error("Zod validation error (params):", error);
           if (error instanceof z.ZodError) {
            const err =  error.errors.map((e:any) => ({
                field: e.path.join('.'),
                message: e.message,
              }))
            
              res.json({
                 status: HttpStatusCode.BAD_REQUEST,
                 message: ResponseMessage.VALIDATION_FAILED,
                 error: err
              })              
           }
            logger.error("Unexpected error during params validation:", error);
           throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}

export {requestBodyValidator, requestParamsValidator, requestQueryValidator }