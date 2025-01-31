"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const express_1 = require("express");
const vendorAuthController = tsyringe_1.container.resolve('IVendorAuthController');
const router = (0, express_1.Router)();
router.use(() => {
    console.log("call is getting in route");
});
router.post('/register', vendorAuthController.register);
router.post('/otp', vendorAuthController.verifyOTP);
router.post('/resent-otp', vendorAuthController.resendOtp);
router.post('/login', vendorAuthController.vendorLogin);
router.post('/forgot-password', vendorAuthController.forgotPassword);
router.post('/reset-password', vendorAuthController.resetPassword);
router.post('/refresh-token', vendorAuthController.setNewAccessToken);
router.post('/google-register', vendorAuthController.googleRegister);
router.post('/google-login', vendorAuthController.googleLogin);
exports.default = router;
