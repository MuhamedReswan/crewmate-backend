import { Router } from "express";
import { container } from "tsyringe";
import { ICommonController } from "../../controllers/v1/implimentation/common/common.controller";

const commonController = container.resolve<ICommonController>('ICommonController');


const router = Router();

 router.get('/image-url/:key',commonController.streamImageByKey);



export default router;