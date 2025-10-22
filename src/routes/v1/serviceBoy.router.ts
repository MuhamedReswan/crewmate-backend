import { container } from "tsyringe";
import { Router } from "express";
import { IServiceBoyController } from "../../controllers/v1/implimentation/serviceBoy/serviceBoy.controller";
import upload from "../../middleware/multer";
import { authMiddleware } from "../../middleware/authorization";
import { IEventController } from "../../controllers/v1/implimentation/event/eventController";


const router = Router();
const serviceBoyController = container.resolve<IServiceBoyController>('IServiceBoyController');
const eventController = container.resolve<IEventController>('IEventController');

const uploadFields = upload.fields([
    { name: "aadharImageFront", maxCount: 1 }, 
    { name: "aadharImageBack", maxCount: 1 }, 
    { name: "profileImage", maxCount: 1 }, 
  ]);

router.get('/profile/:id',authMiddleware,serviceBoyController.loadProfile);
router.get('/works',authMiddleware,eventController.getWorks);
router.get('/:id',authMiddleware,serviceBoyController.loadServiceBoyById);


router.put('/profile',authMiddleware,uploadFields,serviceBoyController.updateProfile);
router.patch('/retry-verify/:id',authMiddleware, serviceBoyController.retryServiceBoyVerfication);



export default router;


