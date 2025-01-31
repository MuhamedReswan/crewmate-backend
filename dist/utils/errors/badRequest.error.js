"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadrequestError = void 0;
const custom_error_1 = require("./custom.error");
class BadrequestError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'BadRequestError';
    }
    serializeErrors() {
        return { message: this.message, name: this.name };
    }
}
exports.BadrequestError = BadrequestError;
