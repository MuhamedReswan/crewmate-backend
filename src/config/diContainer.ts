import { container } from "tsyringe";

import ServiceBoyAuthController from "../controllers/v1/implimentation/serviceBoy/serviceBoyAuth.controller"; 
import ServiceBoyAuthService from "../services/v1/implimentation/serviceBoy/serviceBoyAuth.service"; 
import ServiceBoyAuthRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoyAuth.repository"; 
import VendorAuthController from "../controllers/v1/implimentation/vendor/vendorAuth.controller";
import VendorAuthRepository from "../repositories/v1/implimentation/vendor/vendorAuth.repository";
import VendorAuthService from "../services/v1/implimentation/vendor/vendorAuth.service";
import { serviceBoyModel } from "../models/v1/serviceBoy.model";
import { vendorModel } from "../models/v1/vendor.model";
import { adminModel } from "../models/v1/admin.model";
import ServiceBoyService from "../services/v1/implimentation/serviceBoy/serviceBoy.service";
import ServiceBoyController from "../controllers/v1/implimentation/serviceBoy/serviceBoy.controller";
import ServiceBoyRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import VendorController from "../controllers/v1/implimentation/vendor/vendor.controller";
import VendorService from "../services/v1/implimentation/vendor/vendor.service";
import VendorRepository from "../repositories/v1/implimentation/vendor/vendor.repository";
import CommonController from "../controllers/v1/implimentation/common/common.controller";
import CommonService from "../services/v1/implimentation/common/common.service";
import AdminAuthService from "../services/v1/implimentation/admin/adminAuth.service";
import AdminAuthRepository from "../repositories/v1/implimentation/admin/adminAuth.repository";
import AdminAuthController from "../controllers/v1/implimentation/admin/adminAuth.controller";
import AdminVendorController from "../controllers/v1/implimentation/admin/adminVendor.controller";
import AdminServiceBoyController from "../controllers/v1/implimentation/admin/adminServiceBoy.controller";
import AdminVendorService from "../services/v1/implimentation/admin/adminVendor.service";
import AdminServiceBoyService from "../services/v1/implimentation/admin/adminServiceBoy.service";


// Repository Registration
container.register("IVendorAuthRepository", VendorAuthRepository);
container.register("IVendorRepository", VendorRepository);
container.register("IServiceBoyAuthRepository", ServiceBoyAuthRepository);
container.register("IServiceBoyRepository", ServiceBoyRepository);
container.register("IAdminAuthRepository",AdminAuthRepository);

// Service Registrations
container.register("IVendorAuthService", VendorAuthService);
container.register("IVendorService",VendorService);
container.register("IServiceBoyAuthService", ServiceBoyAuthService);
container.register("IServiceBoyService", ServiceBoyService);
container.register("IAdminAuthService", AdminAuthService);
container.register("IAdminVendorService", AdminVendorService);
container.register("IAdminServiceBoyService", AdminServiceBoyService);
container.register("ICommonService", CommonService);


// Controller Registrations
container.register("IVendorAuthController", VendorAuthController);
container.register("IVendorController",VendorController);
container.register("IServiceBoyAuthController", ServiceBoyAuthController);
container.register("IServiceBoyController", ServiceBoyController);
container.register("IAdminAuthController",AdminAuthController);
container.register("IAdminVendorController",AdminVendorController);
container.register("IAdminServiceBoyController",AdminServiceBoyController);
container.register("ICommonController",CommonController);


// Model Registrations
container.register("ServiceBoyModel", { useValue: serviceBoyModel });
container.register("VendorModel", { useValue: vendorModel });
container.register("AdminModel", { useValue: adminModel });


export default container;