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
const otp_util_1 = require("../../../../utils/otp.util");
const Role_1 = require("../../../../constants/Role");
const logger_util_1 = __importDefault(require("../../../../utils/logger.util"));
const redis_util_1 = require("../../../../utils/redis.util");
const jwt_util_1 = require("../../../../utils/jwt.util");
const unAuthorized_error_1 = require("../../../../utils/errors/unAuthorized.error");
const env_1 = require("../../../../config/env");
let VendorAuthController = class VendorAuthController {
    constructor(_vendorAuthService) {
        this._vendorAuthService = _vendorAuthService;
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, mobile } = req.body;
                yield this._vendorAuthService.register(name, email, password, mobile);
                yield this._vendorAuthService.generateOTP(email);
                res
                    .status(httpStatusCode_1.HttpStatusCode.CREATED)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.REGISTER_SUCCESS, httpStatusCode_1.HttpStatusCode.CREATED, { email }));
            }
            catch (error) {
                logger_util_1.default.error("Vendor registration failed", error);
                next(error);
            }
        });
        this.verifyOTP = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                logger_util_1.default.info("Verifying OTP for vendor", { email });
                let vendorData = yield this._vendorAuthService.verifyOTP(email, otp);
                logger_util_1.default.debug("OTP verified result", { vendorData });
                if (vendorData) {
                    // set access token and refresh token in coockies
                    res.cookie("refreshToken", vendorData.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: env_1.REFRESH_TOKEN_MAX_AGE,
                        sameSite: "lax",
                    });
                    res.cookie("accessToken", vendorData.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                        sameSite: "lax",
                    });
                    res
                        .status(httpStatusCode_1.HttpStatusCode.OK)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.OTP_VERIFICATION_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, vendorData.vendor));
                }
                else {
                    res
                        .status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND, httpStatusCode_1.HttpStatusCode.BAD_REQUEST));
                }
            }
            catch (error) {
                logger_util_1.default.error("Vendor OTP verification failed", error);
                next(error);
            }
        });
        this.resendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                logger_util_1.default.info("Resending OTP to vendor", { email });
                yield this._vendorAuthService.resendOtp(email);
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.RESEND_OTP_SEND, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                logger_util_1.default.error("Resend OTP failed", error);
                next(error);
            }
        });
        this.vendorLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const vendorData = yield this._vendorAuthService.vendorLogin(email, password);
                if (!vendorData) {
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.LOGIN_VERIFICATION_FAILED);
                }
                // set access token and refresh token in coockies
                res.cookie("refreshToken", vendorData.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.REFRESH_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                res.cookie("accessToken", vendorData.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGIN_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, vendorData.vendor));
            }
            catch (error) {
                logger_util_1.default.error("Vendor login failed", error);
                next(error);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                logger_util_1.default.info("Vendor forgot password request", { email });
                const forgotToken = yield this._vendorAuthService.forgotPassword(email);
                if (!forgotToken)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_TOKEN_NOTFOUND);
                yield this._vendorAuthService.resetPasswordLink(forgotToken, email, Role_1.Role.VENDOR);
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_LINK_SEND, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                logger_util_1.default.error("Forgot password process failed", error);
                next(error);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, token } = req.body;
                if (token) {
                    yield this._vendorAuthService.resetPasswordTokenVerify(email, token);
                    yield this._vendorAuthService.resetPassword(email, password);
                }
                else {
                    yield this._vendorAuthService.resetPassword(email, password);
                }
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.RESET_PASSWORD_SUCCESS, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                logger_util_1.default.error("Reset password failed", error);
                next(error);
            }
        });
        this.resetPasswordLink = (token, email, role) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, otp_util_1.sendForgotPasswordLink)(email, token, role);
            }
            catch (error) {
                logger_util_1.default.error("Error sending password reset link", error);
                throw error;
            }
        });
        this.setNewAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    logger_util_1.default.warn("No refresh token provided");
                    res
                        .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.NO_REFRESH_TOKEN, httpStatusCode_1.HttpStatusCode.UNAUTHORIZED));
                }
                const isBlacklisted = yield (0, redis_util_1.getRedisData)(refreshToken);
                if (isBlacklisted) {
                    throw new unAuthorized_error_1.UnAuthorizedError(resposnseMessage_1.ResponseMessage.BLACK_LISTED_TOKEN);
                }
                const result = yield this._vendorAuthService.setNewAccessToken(refreshToken);
                res.cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                    sameSite: "strict",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.ACCESS_TOKEN_SET, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                logger_util_1.default.error("Setting new access token failed", error);
                next(error);
            }
        });
        this.googleAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { googleToken } = req.body;
                logger_util_1.default.info("Google auth started for vendor");
                const vendorData = yield this._vendorAuthService.googleAuth({
                    googleToken,
                });
                if (!vendorData)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.GOOGLE_AUTH_FAILED);
                // set access token and refresh token in coockies
                res.cookie("refreshToken", vendorData.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.REFRESH_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                res.cookie("accessToken", vendorData.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: env_1.ACCESS_TOKEN_MAX_AGE,
                    sameSite: "lax",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGIN_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, vendorData.vendor));
            }
            catch (error) {
                logger_util_1.default.error("Vendor Google auth failed", error);
                next(error);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    res
                        .status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.INVALID_REFRESH_TOKEN, httpStatusCode_1.HttpStatusCode.BAD_REQUEST));
                }
                const decoded = (0, jwt_util_1.decodeRefreshToken)(refreshToken);
                logger_util_1.default.info("decoded token in vendor logout controller", { decoded });
                if (decoded === null || decoded === void 0 ? void 0 : decoded.exp) {
                    const now = Math.floor(Date.now() / 1000);
                    const ttl = decoded.exp - now;
                    yield (0, redis_util_1.setRedisData)(refreshToken, "blacklisted", ttl);
                }
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                });
                res.clearCookie("accessToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGOUT_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, true));
            }
            catch (error) {
                logger_util_1.default.error("Vendor Logout failed", error);
                next(error);
            }
        });
    }
};
VendorAuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IVendorAuthService")),
    __metadata("design:paramtypes", [Object])
], VendorAuthController);
exports.default = VendorAuthController;
