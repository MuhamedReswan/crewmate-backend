import { container } from "tsyringe";
import { Router } from "express";
import { IVendorAuthController } from "../../controllers/v1/interfaces/vendor/IVendorAuth.controller";
import { requestBodyValidator } from "../../middleware/requestValidation";
import { forgotPasswordSchema, loginSchema, resetpasswordSchema, signupSchema } from "../../utils/validationSchema/auth.schema";

const vendorAuthController = container.resolve<IVendorAuthController>('IVendorAuthController');

const router = Router();

const validateLogin = requestBodyValidator(loginSchema);
const validateSingUp = requestBodyValidator(signupSchema);
const validateForgotPassword = requestBodyValidator(forgotPasswordSchema);
const validatePassword = requestBodyValidator(resetpasswordSchema);

router.post('/register', validateSingUp, vendorAuthController.register);
router.post('/otp',vendorAuthController.verifyOTP);
router.post('/resend-otp', vendorAuthController.resendOtp );
router.post('/login', validateLogin, vendorAuthController.vendorLogin);
router.post('/forgot-password', validateForgotPassword, vendorAuthController.forgotPassword);
router.post('/refresh-token',vendorAuthController.setNewAccessToken);
router.post('/google-auth', vendorAuthController.googleAuth);
router.post('/logout',vendorAuthController.logout);


router.patch('/reset-password', validatePassword, vendorAuthController.resetPassword);








export default router;