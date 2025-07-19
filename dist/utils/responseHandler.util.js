"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const logger_util_1 = __importDefault(require("./logger.util"));
//sucess handler
const responseHandler = (message, statusCode, data) => {
    logger_util_1.default.info("data in responseHandler", { data });
    return { message, statusCode: statusCode, data: data || null };
};
exports.responseHandler = responseHandler;
