import { container } from "tsyringe";
import { Router } from "express";
import { IServiceBoyAuthController } from "../../controllers/v1/interfaces/serviceBoy/IServiceBoyAuthController"; 
import { requestBodyValidator } from "../../middleware/requestValidation";
import { forgotPasswordSchema, loginSchema, resetpasswordSchema, signupSchema } from "../../utils/validationSchema/auth.schema";
import { authMiddleware } from "../../middleware/authorization";


const router = Router();
const serviceBoyAuthController = container.resolve<IServiceBoyAuthController>('IServiceBoyAuthController');


const validateLogin = requestBodyValidator(loginSchema);
const validateSingUp = requestBodyValidator(signupSchema);
const validateForgotPassword = requestBodyValidator(forgotPasswordSchema);
const validatePassword = requestBodyValidator(resetpasswordSchema);



router.post('/register', validateSingUp, serviceBoyAuthController.register);
router.post('/otp', serviceBoyAuthController.verifyOTP);
router.post('/resend-otp', serviceBoyAuthController.resendOtp );
router.post('/login', validateLogin, serviceBoyAuthController.serviceBoyLogin);
router.post('/forgot-password', validateForgotPassword, serviceBoyAuthController.forgotPassword);
router.post('/google-auth', serviceBoyAuthController.googleAuth);
router.post('/refresh-token',serviceBoyAuthController.setNewAccessToken);
router.post('/logout',serviceBoyAuthController.logout)

router.patch('/reset-password', validatePassword, serviceBoyAuthController.resetPassword);

router.post('/profile')

//testing purpose
router.post('/token-test',authMiddleware, serviceBoyAuthController.tokenTest)

export default router;


