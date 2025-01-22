import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors/custom.error';

export function errorHandler(err:Error, req:Request, res: Response, next: NextFunction)
     {
    console.error(err);
    if(err instanceof CustomError){
        res.status(err.statusCode).json(err.serializeErrors());
    }
    res.status(500).send('Internal Server Error');
}