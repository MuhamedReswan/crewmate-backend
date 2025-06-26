import { RequestHandler } from "../../../../types/type";

export interface IAdminController {
    verifyLogin: RequestHandler,
    adminLogout: RequestHandler

    
}