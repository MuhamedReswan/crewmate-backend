import { container } from "tsyringe";

// =========================
// Models
// =========================
import { serviceBoyModel } from "../models/v1/serviceBoy.model";
import { vendorModel } from "../models/v1/vendor.model";
import { adminModel } from "../models/v1/admin.model";
import eventModel from "../models/v1/event.model";
import { SystemSettingsModel } from "../models/v1/systemSettings.model";

// =========================
// Controllers
// =========================
import ServiceBoyAuthController from "../controllers/v1/implementation/serviceBoy/serviceBoyAuth.controller"; 
import VendorAuthController from "../controllers/v1/implementation/vendor/vendorAuth.controller";
import ServiceBoyController from "../controllers/v1/implementation/serviceBoy/serviceBoy.controller";
import VendorController from "../controllers/v1/implementation/vendor/vendor.controller";
import CommonController from "../controllers/v1/implementation/common/common.controller";
import AdminAuthController from "../controllers/v1/implementation/admin/adminAuth.controller";
import AdminVendorController from "../controllers/v1/implementation/admin/adminVendor.controller";
import AdminServiceBoyController from "../controllers/v1/implementation/admin/adminServiceBoy.controller";
import EventController from "../controllers/v1/implementation/event/eventController";
import { AdminSystemSettingsController } from "../controllers/v1/implementation/admin/adminSystemSettings.controller";

// =========================
// Services
// =========================
import ServiceBoyAuthService from "../services/v1/implementation/serviceBoy/serviceBoyAuth.service"; 
import VendorAuthService from "../services/v1/implementation/vendor/vendorAuth.service";
import ServiceBoyService from "../services/v1/implementation/serviceBoy/serviceBoy.service";
import VendorService from "../services/v1/implementation/vendor/vendor.service";
import CommonService from "../services/v1/implementation/common/common.service";
import AdminAuthService from "../services/v1/implementation/admin/adminAuth.service";
import AdminVendorService from "../services/v1/implementation/admin/adminVendor.service";
import AdminServiceBoyService from "../services/v1/implementation/admin/adminServiceBoy.service";
import EventService from "../services/v1/implementation/event/event.service";
import { AdminSystemSettingsService } from "../services/v1/implementation/admin/adminSystemSettings.service";

// =========================
// Repositories
// =========================
import ServiceBoyAuthRepository from "../repositories/v1/implementation/serviceBoy/serviceBoyAuth.repository"; 
import VendorAuthRepository from "../repositories/v1/implementation/vendor/vendorAuth.repository";
import ServiceBoyRepository from "../repositories/v1/implementation/serviceBoy/serviceBoy.repository";
import VendorRepository from "../repositories/v1/implementation/vendor/vendor.repository";
import AdminAuthRepository from "../repositories/v1/implementation/admin/adminAuth.repository";
import EventRepository from "../repositories/v1/implementation/event/event.repository";
import { AdminSystemSettingsRepository } from "../repositories/v1/implementation/admin/adminSystemSettings.repository";

// =========================
// Register Models (useValue)
// =========================
container.register("ServiceBoyModel", { useValue: serviceBoyModel });
container.register("VendorModel", { useValue: vendorModel });
container.register("AdminModel", { useValue: adminModel });
container.register("EventModel", { useValue: eventModel });
container.register("SystemSettingsModel", { useValue: SystemSettingsModel });

// =========================
// Repository Registration (useClass)
// =========================
container.register("IVendorAuthRepository", { useClass: VendorAuthRepository });
container.register("IVendorRepository", { useClass: VendorRepository });
container.register("IServiceBoyAuthRepository", { useClass: ServiceBoyAuthRepository });
container.register("IServiceBoyRepository", { useClass: ServiceBoyRepository });
container.register("IAdminAuthRepository", { useClass: AdminAuthRepository });
container.register("IEventRepository", { useClass: EventRepository });
container.register("IAdminSystemSettingsRepository", { useClass: AdminSystemSettingsRepository });

// =========================
// Service Registration (useClass)
// =========================
container.register("IVendorAuthService", { useClass: VendorAuthService });
container.register("IVendorService", { useClass: VendorService });
container.register("IServiceBoyAuthService", { useClass: ServiceBoyAuthService });
container.register("IServiceBoyService", { useClass: ServiceBoyService });
container.register("IAdminAuthService", { useClass: AdminAuthService });
container.register("IAdminVendorService", { useClass: AdminVendorService });
container.register("IAdminServiceBoyService", { useClass: AdminServiceBoyService });
container.register("ICommonService", { useClass: CommonService });
container.register("IEventService", { useClass: EventService });
container.register("IAdminSystemSettingsService", { useClass: AdminSystemSettingsService });

// =========================
// Controller Registration (useClass)
// =========================
container.register("IVendorAuthController", { useClass: VendorAuthController });
container.register("IVendorController", { useClass: VendorController });
container.register("IServiceBoyAuthController", { useClass: ServiceBoyAuthController });
container.register("IServiceBoyController", { useClass: ServiceBoyController });
container.register("IAdminAuthController", { useClass: AdminAuthController });
container.register("IAdminVendorController", { useClass: AdminVendorController });
container.register("IAdminServiceBoyController", { useClass: AdminServiceBoyController });
container.register("ICommonController", { useClass: CommonController });
container.register("IEventController", { useClass: EventController });
container.register("IAdminSystemSettingsController", { useClass: AdminSystemSettingsController });

export default container;
