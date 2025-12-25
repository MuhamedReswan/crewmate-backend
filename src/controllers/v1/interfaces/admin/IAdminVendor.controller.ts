import { RequestHandler } from "../../../../types/type"

export interface IAdminVendorController{
getAllVendorPendingVerification:RequestHandler
verifyVendorByAdmin:RequestHandler
getVendorById:RequestHandler
getVendorSinglePendingVerification:RequestHandler
getAllVendors:RequestHandler
}