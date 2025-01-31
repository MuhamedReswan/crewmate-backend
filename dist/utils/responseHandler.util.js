"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
//sucess handler
const responseHandler = (message, statusCode, data) => {
    return { message, statusCode: statusCode, data: data || null };
};
exports.responseHandler = responseHandler;
