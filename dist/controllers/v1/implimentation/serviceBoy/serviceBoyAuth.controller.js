"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const httpStatusCode_1 = require("../../../../constants/httpStatusCode");
const responseHandler_util_1 = require("../../../../utils/responseHandler.util");
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const jwt_util_1 = require("../../../../utils/jwt.util");
const Role_1 = require("../../../../constants/Role");
const logger_util_1 = __importDefault(require("../../../../utils/logger.util"));
const redis_util_1 = require("../../../../utils/redis.util");
const unAuthorized_error_1 = require("../../../../utils/errors/unAuthorized.error");
const env_1 = require("../../../../config/env");
let ServiceBoyAuthController = class ServiceBoyAuthController {
    constructor(_serviceBoyAuthService) {
        this._serviceBoyAuthService = _serviceBoyAuthService;
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, mobile } = req.body;
                logger_util_1.default.debug("Register controller received: " + JSON.stringify(req.body));
                yield this._serviceBoyAuthService.register(name, email, password, mobile);
                yield this._serviceBoyAuthService.generateOTP(email);
                logger_util_1.default.info(`OTP generated and sent to email: ${email}`);
                res
                    .status(httpStatusCode_1.HttpStatusCode.CREATED)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.REGISTER_SUCCESS, httpStatusCode_1.HttpStatusCode.CREATED, { email }));
            }
            catch (error) {
                logger_util_1.default.error("Service Boy Register error: " + error);
                next(error);
            }
        });
        this.verifyOTP = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                logger_util_1.default.info(`Verifying OTP for email: ${email}`);
                let serviceBoyData = yield this._serviceBoyAuthService.verifyOTP(email, otp);
                logger_util_1.default.debug("verifyOTP result: " + JSON.stringify(serviceBoyData));
                if (serviceBoyData) {
                    // set access token and refresh token in coockies
                    res.cookie("refreshToken", serviceBoyData.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: env_1.REFRESH_TOKEN_MAX_AGE,
                        sameSite: "lax",
                    });
                    res.cookie("accessToken", serviceBoyData.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                        sameSite: "lax",
                    });
                    logger_util_1.default.info(`OTP verified. Access and Refresh tokens generated for: ${email}`);
                    res
                        .status(httpStatusCode_1.HttpStatusCode.OK)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.OTP_VERIFICATION_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, serviceBoyData.serviceBoy));
                }
                else {
                    res
                        .status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND, httpStatusCode_1.HttpStatusCode.BAD_REQUEST));
                }
            }
            catch (error) {
                logger_util_1.default.error(" Service Boy OTP Verification error", error);
                next(error);
            }
        });
        this.resendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                logger_util_1.default.info(`Resending OTP to email: ${email}`);
                yield this._serviceBoyAuthService.resendOtp(email);
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.RESEND_OTP_SEND, httpStatusCode_1.HttpStatusCode.OK, {
                    email,
                    success: true,
                }));
            }
            catch (error) {
                logger_util_1.default.error("Service Boy Resend OTP error", error);
                next(error);
            }
        });
        this.serviceBoyLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const serviceBoyData = yield this._serviceBoyAuthService.serviceBoyLogin(email, password);
                if (!serviceBoyData) {
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.LOGIN_VERIFICATION_FAILED);
                }
                // set access token and refresh token in coockies
                res.cookie("refreshToken", serviceBoyData.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.REFRESH_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                res.cookie("accessToken", serviceBoyData.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                logger_util_1.default.info(`Login success for email: ${email}`);
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGIN_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, serviceBoyData.serviceBoy));
            }
            catch (error) {
                logger_util_1.default.error("Service Boy Login error", error);
                next(error);
            }
        });
        this.setNewAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    logger_util_1.default.warn("No refresh token found in cookies");
                    res
                        .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.NO_REFRESH_TOKEN, httpStatusCode_1.HttpStatusCode.UNAUTHORIZED));
                }
                const isBlacklisted = yield (0, redis_util_1.getRedisData)(refreshToken);
                if (isBlacklisted) {
                    throw new unAuthorized_error_1.UnAuthorizedError(resposnseMessage_1.ResponseMessage.BLACK_LISTED_TOKEN);
                }
                const result = yield this._serviceBoyAuthService.setNewAccessToken(refreshToken);
                res.cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                    sameSite: "strict",
                });
                logger_util_1.default.info("New access token set successfully");
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.ACCESS_TOKEN_SET, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                logger_util_1.default.error("Set New Access Token error", error);
                next(error);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                logger_util_1.default.info(`Forgot password request for email: ${email}`);
                const forgotToken = yield this._serviceBoyAuthService.forgotPassword(email);
                if (!forgotToken)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_TOKEN_NOTFOUND);
                yield this._serviceBoyAuthService.resetPasswordLink(email, forgotToken, Role_1.Role.SERVICE_BOY);
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_LINK_SEND, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                logger_util_1.default.error("Forgot password error", error);
                next(error);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, token } = req.body;
                logger_util_1.default.info(`Resetting password for email: ${email}`);
                if (token) {
                    yield this._serviceBoyAuthService.resetPasswordTokenVerify(email, token);
                    yield this._serviceBoyAuthService.resetPassword(email, password);
                }
                else {
                    yield this._serviceBoyAuthService.resetPassword(email, password);
                }
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.RESET_PASSWORD_SUCCESS, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                logger_util_1.default.error("Reset password error", error);
                next(error);
            }
        });
        this.googleAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { googleToken } = req.body;
                logger_util_1.default.info("Google login token received");
                const serviceBoyData = yield this._serviceBoyAuthService.googleAuth({ googleToken });
                console.log("Google auth result: " + JSON.stringify(serviceBoyData));
                if (!serviceBoyData)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.GOOGLE_AUTH_FAILED);
                console.log("google auth controller serviceBoyData", serviceBoyData);
                console.log("google auth controller serviceBoyData.serviceBoy", serviceBoyData.serviceBoy);
                logger_util_1.default.info("Google login token received", {});
                // set access token and refresh token in coockies
                res.cookie("refreshToken", serviceBoyData.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.REFRESH_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                res.cookie("accessToken", serviceBoyData.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGIN_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, serviceBoyData.serviceBoy));
            }
            catch (error) {
                logger_util_1.default.error("Google login error", error);
                next(error);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("decoded token in sevicebOy logout controller-----------------++++");
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.INVALID_REFRESH_TOKEN, httpStatusCode_1.HttpStatusCode.BAD_REQUEST));
                }
                const decoded = (0, jwt_util_1.decodeRefreshToken)(refreshToken);
                logger_util_1.default.info("decoded token in sevicebOy logout controller", { decoded });
                console.log("decoded token in sevicebOy logout controller-----------------", { decoded });
                if (decoded === null || decoded === void 0 ? void 0 : decoded.exp) {
                    const now = Math.floor(Date.now() / 1000);
                    const ttl = decoded.exp - now;
                    yield (0, redis_util_1.setRedisData)(refreshToken, "blacklisted", ttl);
                }
                res.clearCookie("accessToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                });
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGOUT_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, true));
            }
            catch (error) {
                logger_util_1.default.error("Logout error", error);
                next(error);
            }
        });
        this.tokenTest = (req, res, next) => {
            try {
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)("Test token success", httpStatusCode_1.HttpStatusCode.OK, true));
            }
            catch (error) {
                logger_util_1.default.error("Token test error", error);
                next(error);
            }
        };
    }
};
ServiceBoyAuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IServiceBoyAuthService")),
    __metadata("design:paramtypes", [Object])
], ServiceBoyAuthController);
exports.default = ServiceBoyAuthController;
