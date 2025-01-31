"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../utils/errors/custom.error");
const errorHandler = (err, req, res, next) => {
    //   console.error(err);
    if (err instanceof custom_error_1.CustomError) {
        res.status(err.statusCode).json(err.serializeErrors());
        return;
    }
    res.status(500).json({ message: "Something went wrong" });
};
exports.errorHandler = errorHandler;
