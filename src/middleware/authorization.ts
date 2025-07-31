import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { HttpStatusCode } from "../constants/httpStatusCode";
import { responseHandler } from "../utils/responseHandler.util";
import { ResponseMessage } from "../constants/resposnseMessage";
import { verifyAccessToken } from "../utils/jwt.util";
import { IServiceBoyAuthService } from "../services/v1/interfaces/serviceBoy/IServiceBoyAuthService";
import { IVendorAuthService } from "../services/v1/interfaces/vendor/IVendorAuthService";
// import { IAdminService } from "../services/v1/interfaces/admin/IAdminService";
import logger from "../utils/logger.util";
import { getRedisData } from "../utils/redis.util";
// import { JwtPayload } from "../types/type";



// Extend Express Request type
// export interface AuthenticatedRequest extends Request {
//   user?: JwtPayload;
// }

// Resolve services from container
const serviceBoyAuthService = container.resolve<IServiceBoyAuthService>(
  "IServiceBoyAuthService"
);
const vendorAuthService =
  container.resolve<IVendorAuthService>("IVendorAuthService");
// const AdminService = container.resolve<IAdminService>("IAdminService");

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Auth middleware triggered");
  
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    logger.debug(`Access token present: ${!!accessToken}`);
    logger.debug(`Refresh token present: ${!!refreshToken}`);

    // If access token exists, try verifying it
    if (accessToken) {
      const verfiedAccessToken = await verifyAccessToken(accessToken);
      logger.info("Access token verified");
      if (verfiedAccessToken) {
        return next();
      }         
    }

    // If no access token or it's invalid, check for refresh token
    if (!refreshToken) {
            logger.warn("No refresh token provided");
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          responseHandler(
            ResponseMessage.NO_REFRESH_TOKEN,
            HttpStatusCode.UNAUTHORIZED
          )
        );
      return; 
    } else {

      try {
        const originalUrl = req?.originalUrl;

   const isBlacklisted = await getRedisData(refreshToken);
   logger.warn("isBlacklisted Refresh token--------------------------------",{isBlacklisted});
    if (isBlacklisted) {
      logger.warn("Refresh token is blacklisted");
      res.clearCookie("refreshToken", 
        { httpOnly: true, secure: true, sameSite: "lax" });
      res.clearCookie("accessToken",
         { httpOnly: true, secure: true, sameSite: "lax" });

       res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          responseHandler(
            ResponseMessage.BLACK_LISTED_TOKEN,
            HttpStatusCode.UNAUTHORIZED
          )
        );
        return;
    }

        let tokenRecreate;
        // Create to new access token and refresh token based on the role
        logger.info("athorization middlware url",{originalUrl})
        if (originalUrl.includes("/service-boy")) {
          tokenRecreate = await serviceBoyAuthService.setNewAccessToken(refreshToken);
        } else if (originalUrl.includes("/vendor")) {
          tokenRecreate = await vendorAuthService.setNewAccessToken(
            refreshToken
          );
        } else if (originalUrl.includes("/admin")) {
             logger.info("within authorization originalUrl.includes(/admin)");
          // tokenRecreate = await adminService.setNewToken(refreshToken)
        } else {
        logger.warn("Unknown role in URL path:", { url: originalUrl });
        }

        if (tokenRecreate) {
          // Set new refresh token and acesstoken in cookie
        logger.info("New token generated for refresh");

      //     const verfiedAccessToken = await verifyAccessToken(tokenRecreate.accessToken);
      // console.log("verfiedAccessToken2", verfiedAccessToken )
      // if (verfiedAccessToken) {
      //   req.user = { ...verfiedAccessToken } 
      //   console.log("req.user auth2", req.user);
      // }
          res.cookie("refreshToken", tokenRecreate.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
          });
          res.cookie("accessToken", tokenRecreate.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
            sameSite: "lax",
          });

        return  next();
        }
      } catch (error) {
        logger.error("Error while validating or regenerating tokens",error);
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });

        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json(
            responseHandler(
              ResponseMessage.INVALID_REFRESH_TOKEN,
              HttpStatusCode.UNAUTHORIZED
            )
          );
        return; 
      }
    }
  } catch (error) {
    logger.error("Auth middleware error", { error });
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        responseHandler(
          ResponseMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
  return; 
};

