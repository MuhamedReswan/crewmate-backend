import { Router } from "express";
import v1ServiceBoyRouter from "./v1/serviceBoy.router";
import v1VendorAuthRouter from "./v1/vendor.router";
import v1AdminRouter from "./v1/admin.router";


const router = Router();
router.use((req, res, next) => {
    console.log(`Incoming request Main: ${req.method} ${req.url}`);
    next();
  });

router.use('/api/auth/v1/service-boy',v1ServiceBoyRouter);
router.use('/api/auth/v1/vendor',v1VendorAuthRouter);
router.use('/api/auth/v1/admin',v1AdminRouter);



export default router;