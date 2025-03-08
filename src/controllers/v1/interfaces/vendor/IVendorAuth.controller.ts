import { RequestHandler } from "../../../../utils/type";

export interface IVendorAuthController {
    register:RequestHandler
    verifyOTP: RequestHandler
    resendOtp: RequestHandler
    vendorLogin: RequestHandler
    forgotPassword:RequestHandler
    resetPassword:RequestHandler
    setNewAccessToken:RequestHandler
    googleAuth:RequestHandler
    logout:RequestHandler,

}
