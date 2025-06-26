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
function requestBodyValidator(schema) {
    return (req, res, next) => {
        try {
            console.log("with body validator middleware backend");
            schema.parse(req.body);
            next();
        }
        catch (error) {
            console.log("zod Error", error);
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
            throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
}
function requestQueryValidator(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            console.log("zod Error", error);
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
            throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
}
function requestParamsValidator(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            console.log("zod Error", error);
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
            throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
}
