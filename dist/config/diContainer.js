"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
// =========================
// Models
// =========================
const serviceBoy_model_1 = require("../models/v1/serviceBoy.model");
const vendor_model_1 = require("../models/v1/vendor.model");
const admin_model_1 = require("../models/v1/admin.model");
const event_model_1 = __importDefault(require("../models/v1/event.model"));
const systemSettings_model_1 = require("../models/v1/systemSettings.model");
// =========================
// Controllers
// =========================
const serviceBoyAuth_controller_1 = __importDefault(require("../controllers/v1/implementation/serviceBoy/serviceBoyAuth.controller"));
const vendorAuth_controller_1 = __importDefault(require("../controllers/v1/implementation/vendor/vendorAuth.controller"));
const serviceBoy_controller_1 = __importDefault(require("../controllers/v1/implementation/serviceBoy/serviceBoy.controller"));
const vendor_controller_1 = __importDefault(require("../controllers/v1/implementation/vendor/vendor.controller"));
const common_controller_1 = __importDefault(require("../controllers/v1/implementation/common/common.controller"));
const adminAuth_controller_1 = __importDefault(require("../controllers/v1/implementation/admin/adminAuth.controller"));
const adminVendor_controller_1 = __importDefault(require("../controllers/v1/implementation/admin/adminVendor.controller"));
const adminServiceBoy_controller_1 = __importDefault(require("../controllers/v1/implementation/admin/adminServiceBoy.controller"));
const eventController_1 = __importDefault(require("../controllers/v1/implementation/event/eventController"));
const adminSystemSettings_controller_1 = require("../controllers/v1/implementation/admin/adminSystemSettings.controller");
// =========================
// Services
// =========================
const serviceBoyAuth_service_1 = __importDefault(require("../services/v1/implementation/serviceBoy/serviceBoyAuth.service"));
const vendorAuth_service_1 = __importDefault(require("../services/v1/implementation/vendor/vendorAuth.service"));
const serviceBoy_service_1 = __importDefault(require("../services/v1/implementation/serviceBoy/serviceBoy.service"));
const vendor_service_1 = __importDefault(require("../services/v1/implementation/vendor/vendor.service"));
const common_service_1 = __importDefault(require("../services/v1/implementation/common/common.service"));
const adminAuth_service_1 = __importDefault(require("../services/v1/implementation/admin/adminAuth.service"));
const adminVendor_service_1 = __importDefault(require("../services/v1/implementation/admin/adminVendor.service"));
const adminServiceBoy_service_1 = __importDefault(require("../services/v1/implementation/admin/adminServiceBoy.service"));
const event_service_1 = __importDefault(require("../services/v1/implementation/event/event.service"));
const adminSystemSettings_service_1 = require("../services/v1/implementation/admin/adminSystemSettings.service");
// =========================
// Repositories
// =========================
const serviceBoyAuth_repository_1 = __importDefault(require("../repositories/v1/implementation/serviceBoy/serviceBoyAuth.repository"));
const vendorAuth_repository_1 = __importDefault(require("../repositories/v1/implementation/vendor/vendorAuth.repository"));
const serviceBoy_repository_1 = __importDefault(require("../repositories/v1/implementation/serviceBoy/serviceBoy.repository"));
const vendor_repository_1 = __importDefault(require("../repositories/v1/implementation/vendor/vendor.repository"));
const adminAuth_repository_1 = __importDefault(require("../repositories/v1/implementation/admin/adminAuth.repository"));
const event_repository_1 = __importDefault(require("../repositories/v1/implementation/event/event.repository"));
const adminSystemSettings_repository_1 = require("../repositories/v1/implementation/admin/adminSystemSettings.repository");
// =========================
// Register Models (useValue)
// =========================
tsyringe_1.container.register("ServiceBoyModel", { useValue: serviceBoy_model_1.serviceBoyModel });
tsyringe_1.container.register("VendorModel", { useValue: vendor_model_1.vendorModel });
tsyringe_1.container.register("AdminModel", { useValue: admin_model_1.adminModel });
tsyringe_1.container.register("EventModel", { useValue: event_model_1.default });
tsyringe_1.container.register("SystemSettingsModel", { useValue: systemSettings_model_1.SystemSettingsModel });
// =========================
// Repository Registration (useClass)
// =========================
tsyringe_1.container.register("IVendorAuthRepository", { useClass: vendorAuth_repository_1.default });
tsyringe_1.container.register("IVendorRepository", { useClass: vendor_repository_1.default });
tsyringe_1.container.register("IServiceBoyAuthRepository", { useClass: serviceBoyAuth_repository_1.default });
tsyringe_1.container.register("IServiceBoyRepository", { useClass: serviceBoy_repository_1.default });
tsyringe_1.container.register("IAdminAuthRepository", { useClass: adminAuth_repository_1.default });
tsyringe_1.container.register("IEventRepository", { useClass: event_repository_1.default });
tsyringe_1.container.register("IAdminSystemSettingsRepository", { useClass: adminSystemSettings_repository_1.AdminSystemSettingsRepository });
// =========================
// Service Registration (useClass)
// =========================
tsyringe_1.container.register("IVendorAuthService", { useClass: vendorAuth_service_1.default });
tsyringe_1.container.register("IVendorService", { useClass: vendor_service_1.default });
tsyringe_1.container.register("IServiceBoyAuthService", { useClass: serviceBoyAuth_service_1.default });
tsyringe_1.container.register("IServiceBoyService", { useClass: serviceBoy_service_1.default });
tsyringe_1.container.register("IAdminAuthService", { useClass: adminAuth_service_1.default });
tsyringe_1.container.register("IAdminVendorService", { useClass: adminVendor_service_1.default });
tsyringe_1.container.register("IAdminServiceBoyService", { useClass: adminServiceBoy_service_1.default });
tsyringe_1.container.register("ICommonService", { useClass: common_service_1.default });
tsyringe_1.container.register("IEventService", { useClass: event_service_1.default });
tsyringe_1.container.register("IAdminSystemSettingsService", { useClass: adminSystemSettings_service_1.AdminSystemSettingsService });
// =========================
// Controller Registration (useClass)
// =========================
tsyringe_1.container.register("IVendorAuthController", { useClass: vendorAuth_controller_1.default });
tsyringe_1.container.register("IVendorController", { useClass: vendor_controller_1.default });
tsyringe_1.container.register("IServiceBoyAuthController", { useClass: serviceBoyAuth_controller_1.default });
tsyringe_1.container.register("IServiceBoyController", { useClass: serviceBoy_controller_1.default });
tsyringe_1.container.register("IAdminAuthController", { useClass: adminAuth_controller_1.default });
tsyringe_1.container.register("IAdminVendorController", { useClass: adminVendor_controller_1.default });
tsyringe_1.container.register("IAdminServiceBoyController", { useClass: adminServiceBoy_controller_1.default });
tsyringe_1.container.register("ICommonController", { useClass: common_controller_1.default });
tsyringe_1.container.register("IEventController", { useClass: eventController_1.default });
tsyringe_1.container.register("IAdminSystemSettingsController", { useClass: adminSystemSettings_controller_1.AdminSystemSettingsController });
exports.default = tsyringe_1.container;
