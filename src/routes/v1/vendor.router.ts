import { Router } from "express";
import { container } from "tsyringe";
import { IVendorController } from "../../controllers/v1/implimentation/vendor/vendor.controller";
import upload from "../../middleware/multer";
import { authMiddleware } from "../../middleware/authorization";

const vendorController = container.resolve<IVendorController>('IVendorController');


const router = Router();
const uploadFields = upload.fields([
    { name: "licenceImage", maxCount: 1 }, 
    { name: "profileImage", maxCount: 1 }, 
  ]);

  router.get('/profile/:id',vendorController.loadVendorProfile);

  router.put('/profile',authMiddleware,uploadFields,vendorController.updateVendorProfile);


export default router;