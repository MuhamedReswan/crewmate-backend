"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceBoyAuth_router_1 = __importDefault(require("./v1/serviceBoyAuth.router"));
const serviceBoy_router_1 = __importDefault(require("./v1/serviceBoy.router"));
const vendor_router_1 = __importDefault(require("./v1/vendor.router"));
const admin_router_1 = __importDefault(require("./v1/admin.router"));
// import { authMiddleware } from "../middleware/authorization";
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    console.log(`Incoming request Main: ${req.method} ${req.url}`);
    next();
});
router.use('/api/v1/service-boy', serviceBoy_router_1.default);
router.use('/api/v1/auth/service-boy', serviceBoyAuth_router_1.default);
router.use('/api/v1/auth/vendor', vendor_router_1.default);
router.use('/api/v1/auth/admin', admin_router_1.default);
exports.default = router;
