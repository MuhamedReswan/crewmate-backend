import { RequestHandler } from "../../../../types";

export interface IAdminUserManagementController {
  getAllPendingVerification: RequestHandler;
  getSinglePendingVerification: RequestHandler;
  verifyUserByAdmin: RequestHandler;
  getUsers: RequestHandler;
  getUserById: RequestHandler;
  updateUserStatus: RequestHandler;
}
