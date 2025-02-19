"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceBoy_router_1 = __importDefault(require("./v1/serviceBoy.router"));
const vendor_router_1 = __importDefault(require("./v1/vendor.router"));
const admin_router_1 = __importDefault(require("./v1/admin.router"));
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    console.log(`Incoming request Main: ${req.method} ${req.url}`);
    next();
});
router.use('/api/auth/v1/service-boy', serviceBoy_router_1.default);
router.use('/api/auth/v1/vendor', vendor_router_1.default);
router.use('/api/auth/v1/admin', admin_router_1.default);
exports.default = router;
