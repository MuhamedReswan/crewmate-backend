import { Router } from "express";
import v1ServiceBoyRouter from "./v1/serviceBoy.router";
import v1VendorAuthRouter from "./v1/vendor/vendorAuth.router";

const router = Router();


router.use('/api/auth/v1/service-boy',v1ServiceBoyRouter);
router.use('/api/auth/v1/vendor',v1VendorAuthRouter);



export default router;