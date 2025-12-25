import { RequestHandler } from "../../../../types/type"

export interface IVendorController{
    updateVendorProfile:RequestHandler
    loadVendorProfile:RequestHandler
    retryVendorVerfication:RequestHandler
    loadVendorById:RequestHandler
}