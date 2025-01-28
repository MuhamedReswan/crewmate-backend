import { container } from "tsyringe";
import { Router } from "express";
import { IVendorAuthController } from "../../../controllers/v1/interfaces/vendor/IVendorAuthController";

const vendorAuthController = container.resolve<IVendorAuthController>('IVendorAuthController');

const router = Router();
router.post('/register', vendorAuthController.register);
router.post('/otp',vendorAuthController.verifyOTP);
router.post('/resent-otp', vendorAuthController.resendOtp );





export default router;