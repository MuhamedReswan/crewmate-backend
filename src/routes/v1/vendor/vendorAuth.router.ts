import { container } from "tsyringe";
import { Router } from "express";
import { IVendorAuthController } from "../../../controllers/v1/interfaces/vendor/IVendorAuthController";

const vendorAuthController = container.resolve<IVendorAuthController>('IVendorAuthController');

const router = Router();
router.use(()=>{
    console.log("call is getting in route")
})
router.post('/register', vendorAuthController.register);
router.post('/otp',vendorAuthController.verifyOTP);
router.post('/resent-otp', vendorAuthController.resendOtp );
router.post('/login', vendorAuthController.vendorLogin);





export default router;