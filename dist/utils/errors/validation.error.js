"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const custom_error_1 = require("./custom.error");
class ValidationError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'validationError';
    }
    serializeErrors() {
        return { message: this.message, name: this.name };
    }
}
exports.ValidationError = ValidationError;
