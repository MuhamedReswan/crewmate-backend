import { Router } from "express";
import { container } from "tsyringe";
import { IVendorController } from "../../controllers/v1/implimentation/vendor/vendor.controller";
import upload from "../../middleware/multer";
import { authMiddleware } from "../../middleware/authorization";
import { IEventController } from "../../controllers/v1/implimentation/event/eventController";

const vendorController = container.resolve<IVendorController>('IVendorController');
const eventController = container.resolve<IEventController>('IEventController');


const router = Router();
const uploadFields = upload.fields([
    { name: "licenceImage", maxCount: 1 }, 
    { name: "profileImage", maxCount: 1 }, 
  ]);

  router.use(authMiddleware);

  router.get('/profile/:id',vendorController.loadVendorProfile);
  router.get('/:id',vendorController.loadVendorById);
  
  router.put('/profile',uploadFields,vendorController.updateVendorProfile);
  router.patch('/retry-verify/:id', vendorController.retryVendorVerfication);
  
  router.get('/:vendorId/events',eventController.getEvents);
  
  router.post('/events',eventController.createEvent);

export default router;