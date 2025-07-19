"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestBodyValidator = requestBodyValidator;
exports.requestParamsValidator = requestParamsValidator;
exports.requestQueryValidator = requestQueryValidator;
const zod_1 = __importDefault(require("zod"));
const httpStatusCode_1 = require("../constants/httpStatusCode");
const resposnseMessage_1 = require("../constants/resposnseMessage");
const logger_util_1 = __importDefault(require("../utils/logger.util"));
function requestBodyValidator(schema) {
    return (req, res, next) => {
        try {
            logger_util_1.default.info("Validating request body");
            schema.parse(req.body);
            next();
        }
        catch (error) {
            logger_util_1.default.error("Zod validation error (body):", error);
            if (error instanceof zod_1.default.ZodError) {
                const err = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                res.json({
                    status: httpStatusCode_1.HttpStatusCode.BAD_REQUEST,
                    message: resposnseMessage_1.ResponseMessage.VALIDATION_FAILED,
                    error: err
                });
            }
            logger_util_1.default.error("Unexpected error during body validation:", error);
            throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
}
function requestQueryValidator(schema) {
    return (req, res, next) => {
        try {
            logger_util_1.default.info("Validating request query");
            schema.parse(req.query);
            next();
        }
        catch (error) {
            logger_util_1.default.error("Zod validation error (query):", error);
            if (error instanceof zod_1.default.ZodError) {
                const err = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                res.json({
                    status: httpStatusCode_1.HttpStatusCode.BAD_REQUEST,
                    message: resposnseMessage_1.ResponseMessage.VALIDATION_FAILED,
                    error: err
                });
            }
            logger_util_1.default.error("Unexpected error during query validation:", error);
            throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
}
function requestParamsValidator(schema) {
    return (req, res, next) => {
        try {
            logger_util_1.default.info("Validating request params");
            schema.parse(req.params);
            next();
        }
        catch (error) {
            logger_util_1.default.error("Zod validation error (params):", error);
            if (error instanceof zod_1.default.ZodError) {
                const err = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                res.json({
                    status: httpStatusCode_1.HttpStatusCode.BAD_REQUEST,
                    message: resposnseMessage_1.ResponseMessage.VALIDATION_FAILED,
                    error: err
                });
            }
            logger_util_1.default.error("Unexpected error during params validation:", error);
            throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
}
