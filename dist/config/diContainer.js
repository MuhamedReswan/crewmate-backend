"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const serviceBoyAuth_controller_1 = __importDefault(require("../controllers/v1/implimentation/serviceBoy/serviceBoyAuth.controller"));
const serviceBoyAuth_service_1 = __importDefault(require("../services/v1/implimentation/serviceBoy/serviceBoyAuth.service"));
const serviceBoyAuth_repository_1 = __importDefault(require("../repositories/v1/implimentation/serviceBoy/serviceBoyAuth.repository"));
const vendorAuth_controller_1 = __importDefault(require("../controllers/v1/implimentation/vendor/vendorAuth.controller"));
const vendorAuth_repository_1 = __importDefault(require("../repositories/v1/implimentation/vendor/vendorAuth.repository"));
const vendorAuth_service_1 = __importDefault(require("../services/v1/implimentation/vendor/vendorAuth.service"));
const serviceBoy_model_1 = require("../models/v1/serviceBoy.model");
const vendor_model_1 = require("../models/v1/vendor.model");
// Controller Registrations
tsyringe_1.container.register("IVendorAuthRepository", vendorAuth_repository_1.default);
tsyringe_1.container.register("IServiceBoyAuthRepository", serviceBoyAuth_repository_1.default);
// Service Registrations
tsyringe_1.container.register("IVendorAuthService", vendorAuth_service_1.default);
tsyringe_1.container.register("IServiceBoyAuthService", serviceBoyAuth_service_1.default);
// Repository Registration
tsyringe_1.container.register("IVendorAuthController", vendorAuth_controller_1.default);
tsyringe_1.container.register("IServiceBoyAuthController", serviceBoyAuth_controller_1.default);
// Model Registrations
tsyringe_1.container.register("ServiceBoyModel", { useValue: serviceBoy_model_1.serviceBoyModel });
tsyringe_1.container.register("VendorModel", { useValue: vendor_model_1.vendorModel });
exports.default = tsyringe_1.container;
