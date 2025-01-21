import { container } from "tsyringe";

import { IServiceBoyController } from "../controllers/v1/interfaces/IServiceBoyController";
import  ServiceBoyController  from "../controllers/v1/implimentation/serviceBoy.controller";
import { IServiceBoyService } from "../services/v1/interfaces/IServiceBoyService";
import ServiceBoyService from "../services/v1/implimentation/serviceBoy.service";
import { IServiceBoyRepository } from "../repositories/v1/interfaces/IServiceBoyRepository";
import ServiceBoysRepository from "../repositories/v1/implimentation/serviceBoy.repository";



container.register<IServiceBoyRepository>('IServiceBoyRepository', {useClass: ServiceBoysRepository});
container.register<IServiceBoyService>('IServiceBoyService', {useClass: ServiceBoyService});
container.register<IServiceBoyController>('IServiceBoyController', {useClass: ServiceBoyController});



export default container;