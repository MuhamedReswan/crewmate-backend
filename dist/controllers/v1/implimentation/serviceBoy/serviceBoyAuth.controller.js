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
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const httpStatusCode_1 = require("../../../../constants/httpStatusCode");
const responseHandler_util_1 = require("../../../../utils/responseHandler.util");
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const jwt_util_1 = require("../../../../utils/jwt.util");
const Role_1 = require("../../../../constants/Role");
let ServiceBoyAuthController = class ServiceBoyAuthController {
    constructor(serviceBoyAuthService) {
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, mobile } = req.body;
                console.log("req.body register controller", req.body);
                yield this.serviceBoyAuthService.register(name, email, password, mobile);
                yield this.serviceBoyAuthService.generateOTP(email);
                res
                    .status(httpStatusCode_1.HttpStatusCode.CREATED)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.REGISTER_SUCCESS, httpStatusCode_1.HttpStatusCode.CREATED, { email }));
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyOTP = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                console.log("req.body on controller", req.body);
                let serviceBoy = yield this.serviceBoyAuthService.verifyOTP(email, otp);
                console.log("verifyotp", serviceBoy);
                if (serviceBoy) {
                    const role = Role_1.Role.SERVICE_BOY;
                    const accessToken = (0, jwt_util_1.generateAccessToken)({
                        data: serviceBoy,
                        role: role,
                    });
                    const refreshToken = (0, jwt_util_1.generateRefreshToken)({
                        data: serviceBoy,
                        role: role,
                    });
                    console.log("refresh token", refreshToken);
                    console.log("accessToken token", accessToken);
                    res
                        .status(httpStatusCode_1.HttpStatusCode.OK)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.OTP_VERIFICATION_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, { serviceBoy, role }));
                }
                else {
                    res
                        .status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND, httpStatusCode_1.HttpStatusCode.BAD_REQUEST));
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.resendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log("email from resend otp controller", email);
                yield this.serviceBoyAuthService.resendOtp(email);
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.RESEND_OTP_SEND, httpStatusCode_1.HttpStatusCode.OK, {
                    email,
                    success: true,
                }));
            }
            catch (error) {
                next(error);
            }
        });
        this.serviceBoyLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const serviceBoy = yield this.serviceBoyAuthService.serviceBoyLogin(email, password);
                console.log("serviceBoy from login controller", serviceBoy);
                // set access token and refresh token in coockies
                res.cookie("refreshToken", serviceBoy.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    sameSite: "lax",
                });
                res.cookie("accessToken", serviceBoy.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 15 * 60 * 1000,
                    sameSite: "lax",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGIN_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, serviceBoy));
            }
            catch (error) {
                next(error);
            }
        });
        this.setNewAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    res
                        .status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
                        .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.NO_REFRESH_TOKEN, httpStatusCode_1.HttpStatusCode.UNAUTHORIZED));
                }
                const result = yield this.serviceBoyAuthService.setNewAccessToken(refreshToken);
                console.log("result of new access token form controller", result);
                res.cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600000,
                    sameSite: "strict",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.ACCESS_TOKEN_SET, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                next(error);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const forgotToken = yield this.serviceBoyAuthService.forgotPassword(email);
                if (!forgotToken)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_TOKEN_NOTFOUND);
                yield this.serviceBoyAuthService.resetPasswordLink(email, forgotToken, Role_1.Role.SERVICE_BOY);
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.FORGOT_PASSWORD_LINK_SEND, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, token } = req.body;
                if (token) {
                    yield this.serviceBoyAuthService.resetPasswordTokenVerify(email, token);
                    yield this.serviceBoyAuthService.resetPassword(email, password);
                }
                else {
                    yield this.serviceBoyAuthService.resetPassword(email, password);
                }
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.RESET_PASSWORD_SUCCESS, httpStatusCode_1.HttpStatusCode.OK));
            }
            catch (error) {
                next(error);
            }
        });
        this.googleAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { googleToken } = req.body;
                console.log("googleToken", googleToken);
                const serviceBoy = yield this.serviceBoyAuthService.googleAuth({ googleToken });
                console.log("serviceBoyInfo", serviceBoy);
                if (!serviceBoy)
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.GOOGLE_AUTH_FAILED);
                console.log("serviceBoy from google login controller", serviceBoy);
                // set access token and refresh token in coockies
                res.cookie("refreshToken", serviceBoy.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    sameSite: "lax",
                });
                res.cookie("accessToken", serviceBoy.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 15 * 60 * 1000,
                    sameSite: "lax",
                });
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGIN_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, serviceBoy));
            }
            catch (error) {
                next(error);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("logout service boy invoked");
                res.clearCookie("accessToken").clearCookie("refreshToken");
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)(resposnseMessage_1.ResponseMessage.LOGOUT_SUCCESS, httpStatusCode_1.HttpStatusCode.OK, true));
            }
            catch (error) {
                next();
            }
        });
        this.tokenTest = (req, res, next) => {
            try {
                res
                    .status(httpStatusCode_1.HttpStatusCode.OK)
                    .json((0, responseHandler_util_1.responseHandler)("Test token success", httpStatusCode_1.HttpStatusCode.OK, true));
            }
            catch (error) {
                next();
            }
        };
        this.serviceBoyAuthService = serviceBoyAuthService;
    }
};
ServiceBoyAuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IServiceBoyAuthService")),
    __metadata("design:paramtypes", [Object])
], ServiceBoyAuthController);
exports.default = ServiceBoyAuthController;
