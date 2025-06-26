"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const badRequest_error_1 = require("../../../../utils/errors/badRequest.error");
const redis_util_1 = require("../../../../utils/redis.util");
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const otp_util_1 = require("../../../../utils/otp.util");
const expired_error_1 = require("../../../../utils/errors/expired.error");
const password_util_1 = require("../../../../utils/password.util");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_error_1 = require("../../../../utils/errors/validation.error");
const jwt_util_1 = require("../../../../utils/jwt.util");
const crypto = __importStar(require("crypto"));
const unAuthorized_error_1 = require("../../../../utils/errors/unAuthorized.error");
const Role_1 = require("../../../../constants/Role");
let VendorAuthService = class VendorAuthService {
    constructor(vendorAuthRepository) {
        this.vendorAuthRepository = vendorAuthRepository;
        this.forgotPassword = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.vendorAuthRepository.findVendorByEmail(email);
                if (!vendor)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                const token = crypto.randomBytes(8).toString('hex');
                yield (0, redis_util_1.setRedisData)(`forgotToken:${email}`, token, 1800);
                return token;
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPasswordTokenVerify = (email, token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const forgotTokenData = yield (0, redis_util_1.getRedisData)(`forgotToken:${email}`);
                console.log("forgotTokenData from boy service", forgotTokenData);
                if (!forgotTokenData) {
                    throw new expired_error_1.ExpiredError(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_TOKEN_EXPIRED);
                }
                if (forgotTokenData != token) {
                    throw new validation_error_1.ValidationError(resposnseMessage_1.ResponseMessage.INVALID_FORGOT_PASSWORD_TOKEN);
                }
                yield (0, redis_util_1.deleteRedisData)(`forgotToken:${email}`);
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPassword = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield (0, password_util_1.hashPassword)(password);
                yield this.vendorAuthRepository.updateVendorPassword(email, hashedPassword);
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPasswordLink = (token, email, role) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("email form vendor service", email, token);
                yield (0, otp_util_1.sendForgotPasswordLink)(email, token, role);
            }
            catch (error) {
                throw error;
            }
        });
        this.googleAuth = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { googleToken } = data;
                console.log("googleToken vendor in service", googleToken);
                const response = yield fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${googleToken}` }
                });
                if (!response.ok) {
                    throw new validation_error_1.ValidationError(resposnseMessage_1.ResponseMessage.GOOGLE_AUTH_FAILED);
                }
                const responseData = yield response.json();
                console.log("responseData", responseData);
                let vendor;
                vendor = yield this.vendorAuthRepository.findVendorByEmail(responseData.email);
                if (!vendor) {
                    let { name, email, email_verified: isVerified, picture: profileImage } = responseData;
                    console.log("name before lowercase", name);
                    name = name.toLowerCase();
                    console.log("name after lowercase", name);
                    vendor = yield this.vendorAuthRepository.createVendor({ name, email, isVerified, profileImage });
                }
                if (!vendor)
                    return;
                const role = Role_1.Role.VENDOR;
                const accessToken = (0, jwt_util_1.generateAccessToken)({ data: vendor, role: role });
                const refreshToken = (0, jwt_util_1.generateRefreshToken)({
                    data: vendor,
                    role: role,
                });
                return { vendor, accessToken, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    register(name, email, password, mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("vendorAut register got");
                const existingVendor = yield this.vendorAuthRepository.findVendorByEmail(email);
                console.log("existingVendor", existingVendor);
                if (existingVendor)
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.EMAIL_ALREADY_USED);
                yield (0, redis_util_1.setRedisData)(`vendor:${email}`, JSON.stringify({ name, email, password, mobile }), 3600);
                const registerFromRedis = yield (0, redis_util_1.getRedisData)(`vendor:${email}`);
                console.log("registerFromRedis vendor auth", registerFromRedis);
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    generateOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.vendorAuthRepository.findVendorByEmail(email);
                if (vendor)
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.EMAIL_ALREADY_VERIFIED);
                const otp = (0, otp_util_1.createOtp)();
                yield (0, redis_util_1.setRedisData)(`otpV:${email}`, JSON.stringify({ otp }), 120);
                const savedOtp = yield (0, redis_util_1.getRedisData)(`otpV:${email}`);
                console.log("savedOtp", savedOtp);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    ;
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("within verify otp in vendor authservice");
                console.log(`email:${email},otp:${otp} serivce`);
                const savedOtp = yield (0, redis_util_1.getRedisData)(`otpV:${email}`);
                console.log("savedOtp", savedOtp);
                if (!savedOtp)
                    throw new expired_error_1.ExpiredError(resposnseMessage_1.ResponseMessage.OTP_EXPIRED);
                const { otp: savedOtpValue } = JSON.parse(savedOtp);
                console.log("savedOtpValue", savedOtpValue);
                console.log("otp", otp);
                if (otp !== savedOtpValue)
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.INVALID_OTP);
                const deleteOtp = yield (0, redis_util_1.deleteRedisData)(`otpV:${email}`);
                console.log("deleteotp", deleteOtp);
                const vendorData = yield (0, redis_util_1.getRedisData)(`vendor:${email}`);
                console.log("vendorData  from serivice", vendorData);
                if (vendorData) {
                    const vendorDataObject = JSON.parse(vendorData);
                    console.log("parsed vendorData  from serivice", vendorDataObject);
                    vendorDataObject.password = yield (0, password_util_1.hashPassword)(vendorDataObject.password);
                    const createdVendor = yield this.vendorAuthRepository.createVendor(vendorDataObject);
                    console.log("createdVendor from service", createdVendor);
                    yield (0, redis_util_1.deleteRedisData)(`vendor:${email}`);
                }
            }
            catch (error) {
                console.log(error);
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
                yield (0, redis_util_1.setRedisData)(`otpV:${email}`, JSON.stringify({ otp }), 60);
                let savedOtp = yield (0, redis_util_1.getRedisData)(`otpV:${email}`);
                console.log("savedOtp", savedOtp);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    vendorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.vendorAuthRepository.findVendorByEmail(email);
                console.log("vendor login service", vendor);
                if (!vendor) {
                    throw new notFound_error_1.NotFoundError("Invalid credentials");
                }
                if (!vendor.password)
                    throw new validation_error_1.ValidationError("No password in vendor");
                const validPassword = yield bcrypt_1.default.compare(password, vendor.password);
                if (!validPassword)
                    throw new validation_error_1.ValidationError(resposnseMessage_1.ResponseMessage.INVALID_CREDINTIALS);
                console.log("validPassword login service", validPassword);
                const role = Role_1.Role.VENDOR;
                const accessToken = (0, jwt_util_1.generateAccessToken)({ role, data: vendor });
                const refreshToken = (0, jwt_util_1.generateRefreshToken)({ role, data: vendor });
                console.log("refresh token", refreshToken);
                console.log("accessToken token", accessToken);
                return { vendor, accessToken, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    setNewAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = yield (0, jwt_util_1.verifyRefreshToken)(refreshToken);
                const role = (decoded === null || decoded === void 0 ? void 0 : decoded.role) === Role_1.Role.VENDOR ? Role_1.Role.VENDOR : Role_1.Role.VENDOR;
                console.log("vendor from setNewAccessToken from service", decoded);
                console.log("role from setNewAccessToken from service", role);
                if (!decoded || !decoded.email) {
                    throw new unAuthorized_error_1.UnAuthorizedError(resposnseMessage_1.ResponseMessage.INVALID_REFRESH_TOKEN);
                }
                const vendor = yield this.vendorAuthRepository.findVendorByEmail(decoded.email);
                if (!vendor)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                const accessToken = yield (0, jwt_util_1.generateAccessToken)({ data: vendor, role });
                return {
                    accessToken,
                    message: resposnseMessage_1.ResponseMessage.ACCESS_TOKEN_SET,
                    success: true,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
};
VendorAuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IVendorAuthRepository')),
    __metadata("design:paramtypes", [Object])
], VendorAuthService);
exports.default = VendorAuthService;
