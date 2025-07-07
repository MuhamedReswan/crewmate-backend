import { container } from "tsyringe";

import ServiceBoyAuthController from "../controllers/v1/implimentation/serviceBoy/serviceBoyAuth.controller"; 
import ServiceBoyAuthService from "../services/v1/implimentation/serviceBoy/serviceBoyAuth.service"; 
import ServiceBoyAuthRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoyAuth.repository"; 
import VendorAuthController from "../controllers/v1/implimentation/vendor/vendorAuth.controller";
import VendorAuthRepository from "../repositories/v1/implimentation/vendor/vendorAuth.repository";
import VendorAuthService from "../services/v1/implimentation/vendor/vendorAuth.service";
import { serviceBoyModel } from "../models/v1/serviceBoy.model";
import { vendorModel } from "../models/v1/vendor.model";
import AdminRepository from "../repositories/v1/implimentation/admin/admin.repository";
import AdminService from "../services/v1/implimentation/admin/admin.service";
import { AdminController } from "../controllers/v1/implimentation/admin/admin.controller";
import { adminModel } from "../models/v1/admin.model";
import ServiceBoyService from "../services/v1/implimentation/serviceBoy/serviceBoy.service";
import ServiceBoyController from "../controllers/v1/implimentation/serviceBoy/serviceBoy.controller";
import ServiceBoyRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import VendorController from "../controllers/v1/implimentation/vendor/vendor.controller";
import VendorService from "../services/v1/implimentation/vendor/vendor.service";
import VendorRepository from "../repositories/v1/implimentation/vendor/vendor.repository";
import CommonController from "../controllers/v1/implimentation/common/common.controller";
import CommonService from "../services/v1/implimentation/common/common.service";


// Repository Registration
container.register("IVendorAuthRepository", VendorAuthRepository);
container.register("IVendorRepository", VendorRepository);
container.register("IServiceBoyAuthRepository", ServiceBoyAuthRepository);
container.register("IServiceBoyRepository", ServiceBoyRepository);
container.register("IAdminRepository",AdminRepository);

// Service Registrations
container.register("IVendorAuthService", VendorAuthService);
container.register("IVendorService",VendorService);
container.register("IServiceBoyAuthService", ServiceBoyAuthService);
container.register("IServiceBoyService", ServiceBoyService);
container.register("IAdminService", AdminService);
container.register("ICommonService", CommonService);


// Controller Registrations
container.register("IVendorAuthController", VendorAuthController);
container.register("IVendorController",VendorController);
container.register("IServiceBoyAuthController", ServiceBoyAuthController);
container.register("IServiceBoyController", ServiceBoyController);
container.register("IAdminController",AdminController);
container.register("ICommonController",CommonController);


// Model Registrations
container.register("ServiceBoyModel", { useValue: serviceBoyModel });
container.register("VendorModel", { useValue: vendorModel });
container.register("AdminModel", { useValue: adminModel });


export default container;