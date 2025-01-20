import { container } from "tsyringe";

import { IServiceBoyController } from "../controllers/v1/interfaces/IServiceBoyController";
import  ServiceBoyController  from "../controllers/v1/implimentation/serviceBoy.controller";



container.register<IServiceBoyController>('IServiceBoyController', {useClass: ServiceBoyController});

export default container;