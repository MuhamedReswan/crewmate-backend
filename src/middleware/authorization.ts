import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    try {
        console.log("middlware request",req)
        next()
    } catch (error) {
        console.log(error)
    }
}