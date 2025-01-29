import { container } from "tsyringe";

import { IServiceBoyController } from "../controllers/v1/interfaces/IServiceBoyController";
import  ServiceBoyController  from "../controllers/v1/implimentation/serviceBoy.controller";
import { IServiceBoyService } from "../services/v1/interfaces/IServiceBoyService";
import ServiceBoyService from "../services/v1/implimentation/serviceBoy.service";
import { IServiceBoyRepository } from "../repositories/v1/interfaces/IServiceBoy.repository";
import ServiceBoysRepository from "../repositories/v1/implimentation/serviceBoy.repository";
import { IVendorAuthController } from "../controllers/v1/interfaces/vendor/IVendorAuth.controller";
import VendorAuthController from "../controllers/v1/implimentation/vendor/vendorAuth.controller";
import { IVendorAuthService } from "../services/v1/interfaces/vendor/IVendorAuthService";
import VendorAuthRepository from "../repositories/v1/implimentation/vendor/vendorAuth.repository";
import VendorAuthService from "../services/v1/implimentation/vendor/vendorAuth.service";
import { IVendorAuthRepository } from "../repositories/v1/interfaces/vendor/IVendorAuth.repository";



container.register<IServiceBoyRepository>('IServiceBoyRepository', {useClass: ServiceBoysRepository});
container.register<IServiceBoyService>('IServiceBoyService', {useClass: ServiceBoyService});
container.register<IServiceBoyController>('IServiceBoyController', {useClass: ServiceBoyController});

container.register<IVendorAuthRepository>('IVendorAuthRepository',{useClass: VendorAuthRepository});
container.register<IVendorAuthService>('IVendorAuthService',{useClass: VendorAuthService});
container.register<IVendorAuthController>('IVendorAuthController',{useClass: VendorAuthController});



export default container;