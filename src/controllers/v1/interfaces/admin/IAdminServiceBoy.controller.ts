import { RequestHandler } from "../../../../types/type"

export interface IAdminServiceBoyController{
getAllServiceBoysPendingVerification:RequestHandler
verifyServiceBoyByAdmin:RequestHandler
getAllServiceBoys:RequestHandler
getServiceBoysById:RequestHandler
updateServiceBoyStatus:RequestHandler
getSinglePendingVerification:RequestHandler
}