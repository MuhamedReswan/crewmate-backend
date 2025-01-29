import { RequestHandler } from "../../../../utils/type";

export interface IVendorAuthController {
    register:RequestHandler
    verifyOTP: RequestHandler
    resendOtp: RequestHandler
    vendorLogin: RequestHandler
}
