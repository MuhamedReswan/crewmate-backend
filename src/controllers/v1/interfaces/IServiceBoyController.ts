import { Request, Response } from "express";


export interface IServiceBoyController {
register(req: Request, res: Response): Promise<void>
// generateOTP(req: Request, res: Response): Promise<void>

}