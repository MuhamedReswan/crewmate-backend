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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const redis_util_1 = require("../../../../utils/redis.util");
const otp_util_1 = require("../../../../utils/otp.util");
const otp_util_2 = require("../../../../utils/otp.util");
const password_util_1 = require("../../../../utils/password.util");
const expired_error_1 = require("../../../../utils/errors/expired.error");
const badRequest_error_1 = require("../../../../utils/errors/badRequest.error");
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_error_1 = require("../../../../utils/errors/validation.error");
const jwt_util_1 = require("../../../../utils/jwt.util");
const unAuthorized_error_1 = require("../../../../utils/errors/unAuthorized.error");
const crypto = __importStar(require("crypto"));
let ServiceBoyAuthService = class ServiceBoyAuthService {
    constructor(serviceBoyAuthRepository) {
        this.forgotPassword = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceBoy = yield this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
                if (!serviceBoy)
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
            }
            catch (error) {
                throw error;
            }
        });
        this.googleRegister = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.email)
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.INVALID_INPUT);
                const existingServiceBoy = yield this.serviceBoyAuthRepository.findServiceBoyByEmail(data.email);
                if (existingServiceBoy) {
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.EMAIL_ALREADY_USED);
                }
                yield this.serviceBoyAuthRepository.createServiceBoy(data);
            }
            catch (error) {
                throw error;
            }
        });
        this.googleLogin = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceBoy = yield this.serviceBoyAuthRepository.findServiceBoyByEmail(data.email);
                console.log("service boy from repository google login", serviceBoy);
                if (!serviceBoy) {
                    throw new Error(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                }
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPassword = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield (0, password_util_1.hashPassword)(password);
                yield this.serviceBoyAuthRepository.updateServiceBoyPassword(email, hashedPassword);
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPasswordLink = (token, email) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, otp_util_1.sendForgotPasswordLink)(email, token);
            }
            catch (error) {
                throw error;
            }
        });
        this.serviceBoyAuthRepository = serviceBoyAuthRepository;
    }
    register(name, email, password, mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("ServiceBoyServie register got");
                const existingServiceBoy = yield this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
                console.log("existingServiceBoy", existingServiceBoy);
                if (existingServiceBoy) {
                    console.log("bad request thrown");
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.EMAIL_ALREADY_USED);
                }
                let setServiceBoyData = yield (0, redis_util_1.setRedisData)(`serviceBoy:${email}`, JSON.stringify({ name, email, password, mobile }), 3600);
                console.log("setServiceBoyData", setServiceBoyData);
                let registerFromRedis = yield (0, redis_util_1.getRedisData)(`serviceBoy:${email}`);
                console.log("registerFromRedis", registerFromRedis);
            }
            catch (error) {
                console.log("bad ");
                throw error;
            }
        });
    }
    generateOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceBoy = yield this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
                if (serviceBoy)
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.EMAIL_ALREADY_VERIFIED);
                const otp = (0, otp_util_2.createOtp)();
                yield (0, redis_util_1.setRedisData)(`otpB:${email}`, JSON.stringify({ otp }), 120);
                let savedOtp = yield (0, redis_util_1.getRedisData)(`otpB:${email}`);
                console.log("savedOtp", savedOtp);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("within verify otp in service");
                console.log(`email:${email},otp:${otp} serivce`);
                const savedOtp = yield (0, redis_util_1.getRedisData)(`otpB:${email}`);
                console.log("savedOtp", savedOtp);
                if (!savedOtp)
                    throw new expired_error_1.ExpiredError('OTP expired');
                const { otp: savedOtpValue } = JSON.parse(savedOtp);
                console.log("savedOtpValue", savedOtpValue);
                console.log("otp", otp);
                if (otp !== savedOtpValue)
                    throw new validation_error_1.ValidationError('Invalid OTP');
                let deleteotp = yield (0, redis_util_1.deleteRedisData)(`otpB:${email}`);
                console.log("deleteotp", deleteotp);
                let serviceBoyData = yield (0, redis_util_1.getRedisData)(`serviceBoy:${email}`);
                console.log("serviceBoyData  from serivice", serviceBoyData);
                if (serviceBoyData) {
                    let serviceBoyDataObject = JSON.parse(serviceBoyData);
                    console.log("parsed serviceBoyData  from serivice", serviceBoyDataObject);
                    let number = 1;
                    const servicerId = `A-${number}`;
                    serviceBoyDataObject.password = yield (0, password_util_1.hashPassword)(serviceBoyDataObject.password);
                    serviceBoyDataObject.servicerId = servicerId;
                    let createdBoy = yield this.serviceBoyAuthRepository.createServiceBoy(serviceBoyDataObject);
                    if (!createdBoy) {
                        throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.USER_NOT_CREATED);
                    }
                    number++;
                    console.log("createdBoy from service", createdBoy);
                    yield (0, redis_util_1.deleteRedisData)(`serviceBoy:${email}`);
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    serviceBoyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceBoy = yield this.serviceBoyAuthRepository.findServiceBoyByEmail(email);
                console.log("serviceBoy login service", serviceBoy);
                if (!serviceBoy) {
                    throw new notFound_error_1.NotFoundError("Invalid credentials");
                }
                const validPassword = yield bcrypt_1.default.compare(password, serviceBoy.password);
                if (!validPassword)
                    throw new validation_error_1.ValidationError("Invalid credentials");
                console.log("validPassword login service", validPassword);
                const role = 'Service Boy';
                const accessToken = (0, jwt_util_1.generateAccessToken)({ data: serviceBoy, role: role });
                const refreshToken = (0, jwt_util_1.generateRefreshToken)({ data: serviceBoy, role: role });
                console.log("refresh token", refreshToken);
                console.log("accessToken token", accessToken);
                return { serviceBoy, accessToken, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, redis_util_1.deleteRedisData)(`otpB${email}`);
                const otp = (0, otp_util_2.createOtp)();
                yield (0, redis_util_1.setRedisData)(`otpB:${email}`, JSON.stringify({ otp }), 120);
                let savedOtp = yield (0, redis_util_1.getRedisData)(`otpB:${email}`);
                console.log("savedOtp", savedOtp);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
            }
            catch (error) {
                throw error;
            }
        });
    }
    setNewAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const decoded = yield (0, jwt_util_1.verifyRefreshToken)(refreshToken);
                const role = (_a = decoded === null || decoded === void 0 ? void 0 : decoded.role) !== null && _a !== void 0 ? _a : "Service Boy";
                console.log("sevice boy from setNewAccessToken from service", decoded);
                console.log("role from setNewAccessToken from service", role);
                if (!decoded || !decoded.email) {
                    throw new unAuthorized_error_1.UnAuthorizedError(resposnseMessage_1.ResponseMessage.INVALID_REFRESH_TOKEN);
                }
                const serviceBoy = yield this.serviceBoyAuthRepository.findServiceBoyByEmail(decoded.email);
                if (!serviceBoy)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                const accessToken = yield (0, jwt_util_1.generateAccessToken)({ data: serviceBoy, role });
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
};
ServiceBoyAuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IServiceBoyAuthRepository")),
    __metadata("design:paramtypes", [Object])
], ServiceBoyAuthService);
exports.default = ServiceBoyAuthService;
