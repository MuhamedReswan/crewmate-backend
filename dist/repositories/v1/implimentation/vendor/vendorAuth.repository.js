"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const vendor_model_1 = require("../../../../models/v1/vendor.model");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const otp_util_1 = require("../../../../utils/otp.util");
const redis_util_1 = require("../../../../utils/redis.util");
class VendorAuthRepository {
    findVendorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vendor_model_1.vendorModel.findOne({ email });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    ;
    createVendor(vendorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("vendor got");
                console.log("vendorData", vendorData);
                let vendorDetails = yield vendor_model_1.vendorModel.create(vendorData);
                console.log("vendorDetails from repo create", vendorDetails);
            }
            catch (error) {
                console.log("error from createServiceBoy repository", error);
                throw error;
            }
        });
    }
    ;
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, redis_util_1.deleteRedisData)(`otpV${email}`);
                const otp = (0, otp_util_1.createOtp)();
                yield (0, redis_util_1.setRedisData)(`otpV:${email}`, JSON.stringify({ otp }), 120);
                let savedOtp = yield (0, redis_util_1.getRedisData)(`otpV:${email}`);
                console.log("savedOtpV", savedOtp);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    updateVendorPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedServiceBoy = yield vendor_model_1.vendorModel.findOneAndUpdate({ email }, { password }, { new: true });
                if (!updatedServiceBoy) {
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
}
exports.default = VendorAuthRepository;
