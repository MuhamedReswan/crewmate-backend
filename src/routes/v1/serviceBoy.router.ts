import { container } from "tsyringe";
import { Router } from "express";
import { IServiceBoyController } from "../../controllers/v1/implimentation/serviceBoy/serviceBoy.controller";
import upload from "../../middleware/multer";
import { authMiddleware } from "../../middleware/authorization";


const router = Router();
const serviceBoyController = container.resolve<IServiceBoyController>('IServiceBoyController');

const uploadFields = upload.fields([
    { name: "aadharImageFront", maxCount: 1 }, 
    { name: "aadharImageBack", maxCount: 1 }, 
    { name: "profileImage", maxCount: 1 }, 
  ]);

router.get('/profile/:id',serviceBoyController.loadProfile);

router.post('/profile',authMiddleware,uploadFields,serviceBoyController.updateProfile);


export default router;


