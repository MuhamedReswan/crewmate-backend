// import { container } from "tsyringe";

// import ServiceBoyAuthController from "../controllers/v1/implimentation/serviceBoy/serviceBoyAuth.controller"; 
// import ServiceBoyAuthService from "../services/v1/implimentation/serviceBoy/serviceBoyAuth.service"; 
// import ServiceBoyAuthRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoyAuth.repository"; 
// import VendorAuthController from "../controllers/v1/implimentation/vendor/vendorAuth.controller";
// import VendorAuthRepository from "../repositories/v1/implimentation/vendor/vendorAuth.repository";
// import VendorAuthService from "../services/v1/implimentation/vendor/vendorAuth.service";
// import { serviceBoyModel } from "../models/v1/serviceBoy.model";
// import { vendorModel } from "../models/v1/vendor.model";
// import { adminModel } from "../models/v1/admin.model";
// import ServiceBoyService from "../services/v1/implimentation/serviceBoy/serviceBoy.service";
// import ServiceBoyController from "../controllers/v1/implimentation/serviceBoy/serviceBoy.controller";
// import ServiceBoyRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
// import VendorController from "../controllers/v1/implimentation/vendor/vendor.controller";
// import VendorService from "../services/v1/implimentation/vendor/vendor.service";
// import VendorRepository from "../repositories/v1/implimentation/vendor/vendor.repository";
// import CommonController from "../controllers/v1/implimentation/common/common.controller";
// import CommonService from "../services/v1/implimentation/common/common.service";
// import AdminAuthService from "../services/v1/implimentation/admin/adminAuth.service";
// import AdminAuthRepository from "../repositories/v1/implimentation/admin/adminAuth.repository";
// import AdminAuthController from "../controllers/v1/implimentation/admin/adminAuth.controller";
// import AdminVendorController from "../controllers/v1/implimentation/admin/adminVendor.controller";
// import AdminServiceBoyController from "../controllers/v1/implimentation/admin/adminServiceBoy.controller";
// import AdminVendorService from "../services/v1/implimentation/admin/adminVendor.service";
// import AdminServiceBoyService from "../services/v1/implimentation/admin/adminServiceBoy.service";
// import EventRepository from "../repositories/v1/implimentation/event/event.repository";
// import EventService from "../services/v1/implimentation/event/event.service";
// import EventController from "../controllers/v1/implimentation/event/eventController";
// import eventModel from "../models/v1/event.model";


// // Repository Registration
// container.register("IVendorAuthRepository", VendorAuthRepository);
// container.register("IVendorRepository", VendorRepository);
// container.register("IServiceBoyAuthRepository", ServiceBoyAuthRepository);
// container.register("IServiceBoyRepository", ServiceBoyRepository);
// container.register("IAdminAuthRepository",AdminAuthRepository);
// container.register("IEventRepository",EventRepository);

// // Service Registrations
// container.register("IVendorAuthService", VendorAuthService);
// container.register("IVendorService",VendorService);
// container.register("IServiceBoyAuthService", ServiceBoyAuthService);
// container.register("IServiceBoyService", ServiceBoyService);
// container.register("IAdminAuthService", AdminAuthService);
// container.register("IAdminVendorService", AdminVendorService);
// container.register("IAdminServiceBoyService", AdminServiceBoyService);
// container.register("ICommonService", CommonService);
// container.register("IEventService", EventService);


// // Controller Registrations
// container.register("IVendorAuthController", VendorAuthController);
// container.register("IVendorController",VendorController);
// container.register("IServiceBoyAuthController", ServiceBoyAuthController);
// container.register("IServiceBoyController", ServiceBoyController);
// container.register("IAdminAuthController",AdminAuthController);
// container.register("IAdminVendorController",AdminVendorController);
// container.register("IAdminServiceBoyController",AdminServiceBoyController);
// container.register("ICommonController",CommonController);
// container.register("IEventController",EventController);


// // Model Registrations
// container.register("ServiceBoyModel", { useValue: serviceBoyModel });
// container.register("VendorModel", { useValue: vendorModel });
// container.register("AdminModel", { useValue: adminModel });
// container.register("EventModel", { useValue: eventModel });


// export default container;

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
import ServiceBoyAuthController from "../controllers/v1/implimentation/serviceBoy/serviceBoyAuth.controller"; 
import VendorAuthController from "../controllers/v1/implimentation/vendor/vendorAuth.controller";
import ServiceBoyController from "../controllers/v1/implimentation/serviceBoy/serviceBoy.controller";
import VendorController from "../controllers/v1/implimentation/vendor/vendor.controller";
import CommonController from "../controllers/v1/implimentation/common/common.controller";
import AdminAuthController from "../controllers/v1/implimentation/admin/adminAuth.controller";
import AdminVendorController from "../controllers/v1/implimentation/admin/adminVendor.controller";
import AdminServiceBoyController from "../controllers/v1/implimentation/admin/adminServiceBoy.controller";
import EventController from "../controllers/v1/implimentation/event/eventController";
import { AdminSystemSettingsController } from "../controllers/v1/implimentation/admin/adminSystemSettings.controller";

// =========================
// Services
// =========================
import ServiceBoyAuthService from "../services/v1/implimentation/serviceBoy/serviceBoyAuth.service"; 
import VendorAuthService from "../services/v1/implimentation/vendor/vendorAuth.service";
import ServiceBoyService from "../services/v1/implimentation/serviceBoy/serviceBoy.service";
import VendorService from "../services/v1/implimentation/vendor/vendor.service";
import CommonService from "../services/v1/implimentation/common/common.service";
import AdminAuthService from "../services/v1/implimentation/admin/adminAuth.service";
import AdminVendorService from "../services/v1/implimentation/admin/adminVendor.service";
import AdminServiceBoyService from "../services/v1/implimentation/admin/adminServiceBoy.service";
import EventService from "../services/v1/implimentation/event/event.service";
import { AdminSystemSettingsService } from "../services/v1/implimentation/admin/adminSystemSettings.service";

// =========================
// Repositories
// =========================
import ServiceBoyAuthRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoyAuth.repository"; 
import VendorAuthRepository from "../repositories/v1/implimentation/vendor/vendorAuth.repository";
import ServiceBoyRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import VendorRepository from "../repositories/v1/implimentation/vendor/vendor.repository";
import AdminAuthRepository from "../repositories/v1/implimentation/admin/adminAuth.repository";
import EventRepository from "../repositories/v1/implimentation/event/event.repository";
import { AdminSystemSettingsRepository } from "../repositories/v1/implimentation/admin/adminSystemSettings.repository";

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
