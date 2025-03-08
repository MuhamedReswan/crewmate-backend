import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../constants/httpStatusCode";
import { responseHandler } from "../utils/responseHandler.util";
import { ResponseMessage } from "../constants/resposnseMessage";
import { verifyAccessToken } from "../utils/jwt.util";
import { container } from "tsyringe";
import { IServiceBoyAuthService } from "../services/v1/interfaces/serviceBoy/IServiceBoyAuthService";
import { IVendorAuthService } from "../services/v1/interfaces/vendor/IVendorAuthService";
import { IAdminService } from "../services/v1/interfaces/admin/IAdminService";

// Resolve services from container
const serviceBoyAuthService = container.resolve<IServiceBoyAuthService>(
  "IServiceBoyAuthService"
);
const vendorAuthService =
  container.resolve<IVendorAuthService>("IVendorAuthService");
const AdminService = container.resolve<IAdminService>("IAdminService");

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Middleware request--------------", req.cookies);
    console.log(
      "Middleware authorization------------",
      req.headers["authorization"]
    );

    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    // If access token exists, try verifying it
    if (accessToken) {
      const verfiedAccessToken = await verifyAccessToken(accessToken);
      if (verfiedAccessToken) {
        return next();
      }
    }

    // If no access token or it's invalid, check for refresh token
    if (!refreshToken) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          responseHandler(
            ResponseMessage.NO_REFRESH_TOKEN,
            HttpStatusCode.UNAUTHORIZED
          )
        );
      return; // Ensure we stop here
    } else {

      try {
        const originalUrl = req?.originalUrl;
        let tokenRecreate;
        // Create to new access token and refresh token based on the role
        if (originalUrl.includes("/service-boy")) {
          tokenRecreate = await serviceBoyAuthService.setNewAccessToken(refreshToken);
        } else if (originalUrl.includes("/vendor")) {
          tokenRecreate = await vendorAuthService.setNewAccessToken(
            refreshToken
          );
        } else if (originalUrl.includes("/admin")) {
          // tokenRecreate = await adminService.setNewToken(refreshToken)
        } else {
          console.log("url nor include the specifed role in auth middlware");
        }

        if (tokenRecreate) {
          // Set new refresh token and acesstoken in cookie
          console.log("tokenRecreate", tokenRecreate);
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

          next();
        }
      } catch (error) {
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
        return; // Ensure we stop here
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        responseHandler(
          ResponseMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
  return; // Ensure we stop here
};

