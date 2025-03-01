import z, {ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../constants/httpStatusCode';
import { ValidationError } from '../utils/errors/validation.error';
import { ResponseMessage } from '../constants/resposnseMessage';

function requestBodyValidator(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("with body validator middleware backend");
            schema.parse(req.body);
            next();
        } catch (error) {
           console.log("zod Error", error);
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
           
           throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}


function requestQueryValidator(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
           console.log("zod Error", error);
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
           
           throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}


function requestParamsValidator(schema: ZodSchema) {
    return (req:Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
           console.log("zod Error", error);
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
           
           throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}

export {requestBodyValidator, requestParamsValidator, requestQueryValidator }