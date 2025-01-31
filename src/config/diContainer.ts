import { container } from "tsyringe";

import ServiceBoyAuthController from "../controllers/v1/implimentation/serviceBoy/serviceBoyAuth.controller"; 
import ServiceBoyAuthService from "../services/v1/implimentation/serviceBoy/serviceBoyAuth.service"; 
import ServiceBoyAuthRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoyAuth.repository"; 
import VendorAuthController from "../controllers/v1/implimentation/vendor/vendorAuth.controller";
import VendorAuthRepository from "../repositories/v1/implimentation/vendor/vendorAuth.repository";
import VendorAuthService from "../services/v1/implimentation/vendor/vendorAuth.service";
import { serviceBoyModel } from "../models/v1/serviceBoy.model";
import { vendorModel } from "../models/v1/vendor.model";


// Controller Registrations
container.register("IVendorAuthRepository", VendorAuthRepository);
container.register("IServiceBoyAuthRepository", ServiceBoyAuthRepository);

// Service Registrations
container.register("IVendorAuthService", VendorAuthService);
container.register("IServiceBoyAuthService", ServiceBoyAuthService);


// Repository Registration
container.register("IVendorAuthController", VendorAuthController);
container.register("IServiceBoyAuthController", ServiceBoyAuthController);

// Model Registrations
container.register("ServiceBoyModel", { useValue: serviceBoyModel });
container.register("VendorModel", { useValue: vendorModel });


export default container;