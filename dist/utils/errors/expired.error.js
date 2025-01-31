"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiredError = void 0;
const custom_error_1 = require("./custom.error");
class ExpiredError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 410;
        this.name = "ExpiredError";
    }
    serializeErrors() {
        return { message: this.message, name: this.name };
    }
}
exports.ExpiredError = ExpiredError;
