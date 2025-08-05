import { Router } from "express";
import v1ServiceBoyAuthRouter from "./v1/serviceBoyAuth.router";
import v1ServiceBoyRouter from "./v1/serviceBoy.router";
import v1VendorAuthRouter from "./v1/vendorAuth.router";
import v1AdminAuthRouter from "./v1/adminAuth.router";
import v1AdminRouter from "./v1/admin.router";
import v1VendorRouter from "./v1/vendor.router";
import v1CommonRouter from "./v1/common.router";


const router = Router();
router.use((req, res, next) => {
    console.log(`Incoming request Main: ${req.method} ${req.url}`);
    next();
  });

  router.use('/api/v1/auth/service-boy', v1ServiceBoyAuthRouter);
  router.use('/api/v1/auth/vendor', v1VendorAuthRouter);
  router.use('/api/v1/auth/admin',v1AdminAuthRouter);
  router.use('/api/v1/admin',v1AdminRouter);
  router.use('/api/v1/service-boy', v1ServiceBoyRouter);
  router.use('/api/v1/vendor', v1VendorRouter);
  router.use('/api/v1', v1CommonRouter);



export default router;