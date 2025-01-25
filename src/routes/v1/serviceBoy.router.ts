import { container } from "tsyringe";
import { Router } from "express";
import { IServiceBoyController } from "../../controllers/v1/interfaces/IServiceBoyController";


const router = Router();
const serviceBoyController = container.resolve<IServiceBoyController>('IServiceBoyController');


router.post('/register', serviceBoyController.register);
router.post('/otp',serviceBoyController.verifyOTP);
router.post('/resent-otp', serviceBoyController.resendOtp );
router.post('/login', serviceBoyController.serviceBoyLogin);
router.post('/forgot-password', serviceBoyController.forgotPassword);
router.post('/reset-forgot-password', serviceBoyController.forgotResetPassword);


export default router;