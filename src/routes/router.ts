import { Router } from "express";
import v1ServiceBoyAuthRouter from "./v1/serviceBoy.router";
import v1VendorAuthRouter from "./v1/vendor.router";
import v1AdminRouter from "./v1/admin.router";


const router = Router();
router.use((req, res, next) => {
    console.log(`Incoming request Main: ${req.method} ${req.url}`);
    next();
  });

router.use('/api/v1/auth/service-boy',v1ServiceBoyAuthRouter);
router.use('/api/v1/auth/vendor',v1VendorAuthRouter);
router.use('/api/v1/auth/admin',v1AdminRouter);



export default router;