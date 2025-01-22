import z, {ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

function requestBodyValidator(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
           console.log("zod Error", error);
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
        }
    }
}

