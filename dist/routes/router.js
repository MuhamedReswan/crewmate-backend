"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceBoy_router_1 = __importDefault(require("./v1/serviceBoy.router"));
const vendorAuth_router_1 = __importDefault(require("./v1/vendor/vendorAuth.router"));
const router = (0, express_1.Router)();
router.use('/api/auth/v1/service-boy', serviceBoy_router_1.default);
router.use('/api/auth/v1/vendor', vendorAuth_router_1.default);
exports.default = router;
