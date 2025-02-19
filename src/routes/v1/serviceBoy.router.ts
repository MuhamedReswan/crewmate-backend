import { container } from "tsyringe";
import { Router } from "express";
import { IServiceBoyAuthController } from "../../controllers/v1/interfaces/serviceBoy/IServiceBoyAuthController"; 


const router = Router();
const serviceBoyAuthController = container.resolve<IServiceBoyAuthController>('IServiceBoyAuthController');


router.post('/register', serviceBoyAuthController.register);
router.post('/otp',serviceBoyAuthController.verifyOTP);
router.post('/resend-otp', serviceBoyAuthController.resendOtp );
router.post('/login', serviceBoyAuthController.serviceBoyLogin);
router.post('/forgot-password', serviceBoyAuthController.forgotPassword);
router.post('/reset-password', serviceBoyAuthController.resetPassword);
router.post('/google-register', serviceBoyAuthController.googleRegister);
router.post('/google-login', serviceBoyAuthController.googleLogin);
router.post('/refresh-token',serviceBoyAuthController.setNewAccessToken);
router.post('/logout',serviceBoyAuthController.logout)



export default router;