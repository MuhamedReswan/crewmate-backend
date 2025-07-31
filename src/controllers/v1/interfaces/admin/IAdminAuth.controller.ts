import { RequestHandler } from "../../../../types/type";

export interface IAdminAuthController {
    verifyLogin: RequestHandler,
    adminLogout: RequestHandler

    
}