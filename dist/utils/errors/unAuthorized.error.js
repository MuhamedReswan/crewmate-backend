"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnAuthorizedError = void 0;
const custom_error_1 = require("./custom.error");
class UnAuthorizedError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.name = "UnAuthorizedError";
    }
    serializeErrors() {
        return { message: this.message, name: this.name };
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
