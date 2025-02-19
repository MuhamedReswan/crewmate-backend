import { container } from "tsyringe";
import { Router } from "express";
import { IVendorAuthController } from "../../controllers/v1/interfaces/vendor/IVendorAuth.controller";

const vendorAuthController = container.resolve<IVendorAuthController>('IVendorAuthController');

const router = Router();

router.use((req, res, next) => {
    console.log(`Incoming vendor request: ${req.method} ${req.url}`);
    next();
  });
  
router.post('/register', vendorAuthController.register);
router.post('/otp',vendorAuthController.verifyOTP);
router.post('/resend-otp', vendorAuthController.resendOtp );
router.post('/login', vendorAuthController.vendorLogin);
router.post('/forgot-password', vendorAuthController.forgotPassword);
router.post('/reset-password', vendorAuthController.resetPassword);
router.post('/refresh-token',vendorAuthController.setNewAccessToken);
router.post('/google-register', vendorAuthController.googleRegister);
router.post('/google-login', vendorAuthController.googleLogin);








export default router;