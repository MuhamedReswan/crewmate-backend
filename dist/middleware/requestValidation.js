"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function requestBodyValidator(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            console.log("zod Error", error);
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
        }
    };
}
