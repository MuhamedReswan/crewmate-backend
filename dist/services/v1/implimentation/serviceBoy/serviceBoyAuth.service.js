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
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const redis_util_1 = __importStar(require("../../../../utils/redis.util"));
const otp_util_1 = require("../../../../utils/otp.util");
const otp_util_2 = require("../../../../utils/otp.util");
const password_util_1 = require("../../../../utils/password.util");
const expired_error_1 = require("../../../../utils/errors/expired.error");
const badRequest_error_1 = require("../../../../utils/errors/badRequest.error");
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const validation_error_1 = require("../../../../utils/errors/validation.error");
const jwt_util_1 = require("../../../../utils/jwt.util");
const unAuthorized_error_1 = require("../../../../utils/errors/unAuthorized.error");
const Role_1 = require("../../../../constants/Role");
const logger_util_1 = __importDefault(require("../../../../utils/logger.util"));
const serviceBoy_mapper_1 = require("../../../../mappers.ts/serviceBoy.mapper");
const googleImageupload_util_1 = require("../../../../utils/googleImageupload.util");
const verificationStatus_1 = require("../../../../constants/verificationStatus");
let ServiceBoyAuthService = class ServiceBoyAuthService {
    constructor(_serviceBoyAuthRepository) {
        this.forgotPassword = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceBoy = yield this._serviceBoyAuthRepository.findServiceBoyByEmail(email);
                if (!serviceBoy)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                const token = crypto.randomBytes(8).toString("hex");
                yield (0, redis_util_1.setRedisData)(`forgotToken-SB:${email}`, token, 1800);
                return token;
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPasswordTokenVerify = (email, token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const forgotTokenData = yield (0, redis_util_1.getRedisData)(`forgotToken-SB:${email}`);
                if (!forgotTokenData) {
                    throw new expired_error_1.ExpiredError(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_TOKEN_EXPIRED);
                }
                if (forgotTokenData != token) {
                    throw new validation_error_1.ValidationError(resposnseMessage_1.ResponseMessage.INVALID_FORGOT_PASSWORD_TOKEN);
                }
                yield (0, redis_util_1.deleteRedisData)(`forgotToken-SB:${email}`);
            }
            catch (error) {
                throw error;
            }
        });
        this.googleAuth = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_util_1.default.info("Google auth initiated");
                const { googleToken } = data;
                const response = yield fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${googleToken}` },
                });
                if (!response.ok) {
                    throw new validation_error_1.ValidationError("google login falied");
                }
                const responseData = yield response.json();
                let serviceBoyData;
                serviceBoyData =
                    yield this._serviceBoyAuthRepository.findServiceBoyByEmail(responseData.email);
                const number = yield redis_util_1.default.incr("serviceBoy:idCounter"); // auto-increment
                const servicerId = `A-${number}`;
                if (!serviceBoyData) {
                    let { name, email, picture: profileImage } = responseData;
                    let isVerified = verificationStatus_1.VerificationStatus.Pending;
                    name = name.toLowerCase();
                    let profileImageKey = undefined;
                    if (profileImage) {
                        try {
                            profileImageKey = yield (0, googleImageupload_util_1.storeGoogleImageToS3)(profileImage, name);
                            logger_util_1.default.info("Uploaded Google profile image to S3", { profileImageKey });
                        }
                        catch (uploadError) {
                            logger_util_1.default.warn("Failed to upload Google image to S3, using original URL instead", uploadError);
                            profileImageKey = profileImage;
                        }
                    }
                    serviceBoyData = yield this._serviceBoyAuthRepository.createServiceBoy({
                        name,
                        email,
                        isVerified,
                        servicerId: servicerId,
                        profileImage: profileImageKey,
                    });
                }
                const serviceBoy = (0, serviceBoy_mapper_1.mapToServiceBoyLoginDTO)(serviceBoyData);
                const role = Role_1.Role.SERVICE_BOY;
                const accessToken = (0, jwt_util_1.generateAccessToken)({
                    data: {
                        _id: serviceBoyData._id,
                        email: serviceBoyData.email,
                        name: serviceBoyData.name,
                    },
                    role: role,
                });
                const refreshToken = (0, jwt_util_1.generateRefreshToken)({
                    data: {
                        _id: serviceBoyData._id,
                        email: serviceBoyData.email,
                        name: serviceBoyData.name,
                    },
                    role: role,
                });
                return { serviceBoy, accessToken, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPassword = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield (0, password_util_1.hashPassword)(password);
                yield this._serviceBoyAuthRepository.updateServiceBoyPassword(email, hashedPassword);
            }
            catch (error) {
                throw error;
            }
        });
        this.resetPasswordLink = (email, token, role) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, otp_util_1.sendForgotPasswordLink)(email, token, role);
            }
            catch (error) {
                throw error;
            }
        });
        this._serviceBoyAuthRepository = _serviceBoyAuthRepository;
    }
    register(name, email, password, mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingServiceBoy = yield this._serviceBoyAuthRepository.findServiceBoyByEmail(email);
                if (existingServiceBoy) {
                    logger_util_1.default.warn(`Email already used: ${email}`);
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.EMAIL_ALREADY_USED);
                }
                yield (0, redis_util_1.setRedisData)(`serviceBoy:${email}`, JSON.stringify({ name, email, password, mobile }), 3600);
                yield (0, redis_util_1.getRedisData)(`serviceBoy:${email}`);
                logger_util_1.default.info(`Registration data cached for ${email}`);
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceBoy = yield this._serviceBoyAuthRepository.findServiceBoyByEmail(email);
                if (serviceBoy)
                    throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.EMAIL_ALREADY_VERIFIED);
                const otp = (0, otp_util_2.createOtp)();
                yield (0, redis_util_1.setRedisData)(`otpB:${email}`, JSON.stringify({ otp }), 60);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
                logger_util_1.default.info(`OTP sent to ${email}  otp-----${otp}`);
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_util_1.default.info(`Verifying OTP for: ${email}`);
                logger_util_1.default.debug(`Incoming OTP data`, { email, otp });
                const savedOtp = yield (0, redis_util_1.getRedisData)(`otpB:${email}`);
                logger_util_1.default.debug(`Fetched saved OTP from Redis`, { savedOtp });
                if (!savedOtp)
                    throw new expired_error_1.ExpiredError("OTP expired");
                const { otp: savedOtpValue } = JSON.parse(savedOtp);
                logger_util_1.default.debug(`Parsed savedOtpValue`, { savedOtpValue });
                if (otp !== savedOtpValue)
                    throw new validation_error_1.ValidationError("Invalid OTP");
                yield (0, redis_util_1.deleteRedisData)(`otpB:${email}`);
                let serviceBoyData = yield (0, redis_util_1.getRedisData)(`serviceBoy:${email}`);
                if (serviceBoyData) {
                    let serviceBoyDataObject = JSON.parse(serviceBoyData);
                    logger_util_1.default.debug("Parsed serviceBoyData from service", {
                        serviceBoyDataObject,
                    });
                    const number = yield redis_util_1.default.incr("serviceBoy:idCounter"); // auto-increment
                    const servicerId = `A-${number}`;
                    serviceBoyDataObject.password = yield (0, password_util_1.hashPassword)(serviceBoyDataObject.password);
                    serviceBoyDataObject.servicerId = servicerId;
                    serviceBoyDataObject.name = serviceBoyDataObject.name.toLowerCase();
                    let createdBoy = yield this._serviceBoyAuthRepository.createServiceBoy(serviceBoyDataObject);
                    if (!createdBoy) {
                        throw new badRequest_error_1.BadrequestError(resposnseMessage_1.ResponseMessage.USER_NOT_CREATED);
                    }
                    yield (0, redis_util_1.deleteRedisData)(`serviceBoy:${email}`);
                    const serviceBoy = (0, serviceBoy_mapper_1.mapToServiceBoyLoginDTO)(createdBoy);
                    const role = Role_1.Role.SERVICE_BOY;
                    const accessToken = (0, jwt_util_1.generateAccessToken)({
                        data: {
                            _id: createdBoy._id,
                            email: createdBoy.email,
                            name: createdBoy.name,
                        },
                        role: role,
                    });
                    const refreshToken = (0, jwt_util_1.generateRefreshToken)({
                        data: {
                            _id: createdBoy._id,
                            email: createdBoy.email,
                            name: createdBoy.name,
                        },
                        role: role,
                    });
                    return { serviceBoy, accessToken, refreshToken };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    serviceBoyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let serviceBoyData = yield this._serviceBoyAuthRepository.findServiceBoyByEmail(email);
                const isValidPassword = (serviceBoyData === null || serviceBoyData === void 0 ? void 0 : serviceBoyData.password) &&
                    (yield bcrypt_1.default.compare(password, serviceBoyData.password));
                if (!serviceBoyData || !isValidPassword) {
                    logger_util_1.default.warn(`Invalid credentials for email: ${email}`);
                    throw new validation_error_1.ValidationError(resposnseMessage_1.ResponseMessage.INVALID_CREDINTIALS);
                }
                const serviceBoy = (0, serviceBoy_mapper_1.mapToServiceBoyLoginDTO)(serviceBoyData);
                const role = Role_1.Role.SERVICE_BOY;
                const accessToken = (0, jwt_util_1.generateAccessToken)({
                    data: {
                        _id: serviceBoyData._id,
                        email: serviceBoyData.email,
                        name: serviceBoyData.name,
                    },
                    role: role,
                });
                const refreshToken = (0, jwt_util_1.generateRefreshToken)({
                    data: {
                        _id: serviceBoyData._id,
                        email: serviceBoyData.email,
                        name: serviceBoyData.name,
                    },
                    role: role,
                });
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
                logger_util_1.default.info(`Resend OTP for email service layer: ${email}`);
                yield (0, redis_util_1.getRedisData)(`otpB${email}`);
                yield (0, redis_util_1.deleteRedisData)(`otpB${email}`);
                const otp = (0, otp_util_2.createOtp)();
                logger_util_1.default.info("resend otp------------", { otp });
                yield (0, redis_util_1.setRedisData)(`otpB:${email}`, JSON.stringify({ otp }), 60);
                yield (0, redis_util_1.getRedisData)(`otpB:${email}`);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
            }
            catch (error) {
                throw error;
            }
        });
    }
    setNewAccessToken(Token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = yield (0, jwt_util_1.verifyRefreshToken)(Token);
                logger_util_1.default.debug("decodedrole", { decoded });
                if (!decoded || !decoded.email) {
                    throw new unAuthorized_error_1.UnAuthorizedError(resposnseMessage_1.ResponseMessage.INVALID_REFRESH_TOKEN);
                }
                const serviceBoy = yield this._serviceBoyAuthRepository.findServiceBoyByEmail(decoded.email);
                if (!serviceBoy)
                    throw new unAuthorized_error_1.UnAuthorizedError(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                if (serviceBoy.isBlocked)
                    throw new validation_error_1.ValidationError(resposnseMessage_1.ResponseMessage.USER_BLOCKED_BY_ADMIN);
                const accessToken = yield (0, jwt_util_1.generateAccessToken)({
                    data: serviceBoy,
                    role: Role_1.Role.SERVICE_BOY,
                });
                const refreshToken = yield (0, jwt_util_1.generateRefreshToken)({
                    data: serviceBoy,
                    role: Role_1.Role.SERVICE_BOY,
                });
                logger_util_1.default.info(`New tokens generated for: ${decoded.email}`);
                return {
                    accessToken,
                    refreshToken,
                    message: resposnseMessage_1.ResponseMessage.TOKEN_SET_SUCCESS,
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
