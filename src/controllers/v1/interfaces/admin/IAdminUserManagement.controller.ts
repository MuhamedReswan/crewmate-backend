import { RequestHandler } from "../../../../types";

export interface IAdminUserManagementController {
 getAllPendingVerification:RequestHandler,
 getSinglePendingVerification: RequestHandler,
 verifyUserByAdmin:RequestHandler,
}