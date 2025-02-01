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


// Repository Registration
container.register("IVendorAuthRepository", VendorAuthRepository);
container.register("IServiceBoyAuthRepository", ServiceBoyAuthRepository);
container.register("IAdminRepository",AdminRepository);

// Service Registrations
container.register("IVendorAuthService", VendorAuthService);
container.register("IServiceBoyAuthService", ServiceBoyAuthService);
container.register("IAdminService", AdminService);


// Controller Registrations
container.register("IVendorAuthController", VendorAuthController);
container.register("IServiceBoyAuthController", ServiceBoyAuthController);
container.register("IAdminController",AdminController);

// Model Registrations
container.register("ServiceBoyModel", { useValue: serviceBoyModel });
container.register("VendorModel", { useValue: vendorModel });
container.register("AdminModel", { useValue: adminModel });


export default container;