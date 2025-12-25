"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../utils/errors/custom.error");
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const resposnseMessage_1 = require("../constants/resposnseMessage");
const errorHandler = (err, req, res, next) => {
    logger_util_1.default.error("Unhandled error in request", { error: err });
    if (err instanceof custom_error_1.CustomError) {
        res.status(err.statusCode).json(err.serializeErrors());
        return;
    }
    res.status(500).json({ message: resposnseMessage_1.ResponseMessage.INTERNAL_SERVER_ERROR });
};
exports.errorHandler = errorHandler;
