import { container } from "tsyringe";

import { IServiceBoyAuthController } from "../controllers/v1/interfaces/serviceBoy/IServiceBoyAuthController";
import ServiceBoyAuthController from "../controllers/v1/implimentation/serviceBoy/serviceBoyAuth.controller"; 
import { IServiceBoyAuthService } from "../services/v1/interfaces/serviceBoy/IServiceBoyAuthService";
import ServiceBoyAuthService from "../services/v1/implimentation/serviceBoy/serviceBoyAuth.service"; 
import { IServiceBoyAuthRepository } from "../repositories/v1/interfaces/serviceBoy/IServiceBoyAuth.repository"; 
import ServiceBoyAuthRepository from "../repositories/v1/implimentation/serviceBoy/serviceBoyAuth.repository"; 
import { IVendorAuthController } from "../controllers/v1/interfaces/vendor/IVendorAuth.controller";
import VendorAuthController from "../controllers/v1/implimentation/vendor/vendorAuth.controller";
import { IVendorAuthService } from "../services/v1/interfaces/vendor/IVendorAuthService";
import VendorAuthRepository from "../repositories/v1/implimentation/vendor/vendorAuth.repository";
import VendorAuthService from "../services/v1/implimentation/vendor/vendorAuth.service";
import { IVendorAuthRepository } from "../repositories/v1/interfaces/vendor/IVendorAuth.repository";



container.register<IServiceBoyAuthRepository>('IServiceBoyAuthRepository', {useClass: ServiceBoyAuthRepository});
container.register<IServiceBoyAuthService>('IServiceBoyAuthService', {useClass: ServiceBoyAuthService});
container.register<IServiceBoyAuthController>('IServiceBoyAuthController', {useClass: ServiceBoyAuthController});

container.register<IVendorAuthRepository>('IVendorAuthRepository',{useClass: VendorAuthRepository});
container.register<IVendorAuthService>('IVendorAuthService',{useClass: VendorAuthService});
container.register<IVendorAuthController>('IVendorAuthController',{useClass: VendorAuthController});



export default container;