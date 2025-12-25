"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRefreshToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const unAuthorized_error_1 = require("./errors/unAuthorized.error");
const logger_util_1 = __importDefault(require("./logger.util"));
const resposnseMessage_1 = require("../constants/resposnseMessage");
const accessTokenSecret = env_1.ACCESSTOKENSECRET;
const refreshTokenSecret = env_1.REFRESHTOKENSECRET;
console.log("accessTokenSecret", accessTokenSecret);
console.log("refreshTokenSecret", refreshTokenSecret);
const generateAccessToken = (details) => {
    var _a, _b, _c;
    if (!accessTokenSecret) {
        throw new Error(resposnseMessage_1.ResponseMessage.NO_ACCESS_TOKEN_SECRET);
    }
    return jsonwebtoken_1.default.sign({ id: (_a = details.data) === null || _a === void 0 ? void 0 : _a._id, email: (_b = details.data) === null || _b === void 0 ? void 0 : _b.email,
        name: (_c = details.data) === null || _c === void 0 ? void 0 : _c.name, role: details.role }, accessTokenSecret, { expiresIn: '50m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (details) => {
    var _a, _b, _c;
    try {
        if (!refreshTokenSecret) {
            throw new Error(resposnseMessage_1.ResponseMessage.NO_REFRESH_TOKEN_SECRET);
        }
        console.log(" generateRefreshToken", refreshTokenSecret);
        return jsonwebtoken_1.default.sign({ id: (_a = details.data) === null || _a === void 0 ? void 0 : _a._id, email: (_b = details.data) === null || _b === void 0 ? void 0 : _b.email,
            name: (_c = details.data) === null || _c === void 0 ? void 0 : _c.name, role: details.role }, refreshTokenSecret, { expiresIn: '7d' });
    }
    catch (error) {
        throw error;
    }
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        if (!accessTokenSecret) {
            throw new Error(resposnseMessage_1.ResponseMessage.NO_ACCESS_TOKEN_SECRET);
        }
        return jsonwebtoken_1.default.verify(token, accessTokenSecret);
    }
    catch (error) {
        logger_util_1.default.error("Failed to verify access token", error);
        return undefined;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        if (!refreshTokenSecret) {
            throw new Error(resposnseMessage_1.ResponseMessage.NO_REFRESH_TOKEN_SECRET);
        }
        const decoded = jsonwebtoken_1.default.verify(token, refreshTokenSecret);
        return decoded;
    }
    catch (error) {
        console.log("verify refresh token error", error);
        throw new unAuthorized_error_1.UnAuthorizedError(resposnseMessage_1.ResponseMessage.INVALID_REFRESH_TOKEN);
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const decodeRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch (error) {
        console.error("Failed to decode refresh token:", error);
        return null;
    }
};
exports.decodeRefreshToken = decodeRefreshToken;
