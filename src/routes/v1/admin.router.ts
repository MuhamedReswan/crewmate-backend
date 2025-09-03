import { Router } from "express";
import { container } from "tsyringe";
import { IAdminVendorController } from "../../controllers/v1/implimentation/admin/adminVendor.controller";
import { IAdminServiceBoyController } from "../../controllers/v1/implimentation/admin/adminServiceBoy.controller";

const router = Router();

const adminVendorController = container.resolve<IAdminVendorController>('IAdminVendorController');
const adminServiceBoyController = container.resolve<IAdminServiceBoyController>('IAdminServiceBoyController');



router.get('/service-boys/verify', adminServiceBoyController.getAllServiceBoysPendingVerification);
router.get('/service-boys/verify/:id', adminServiceBoyController.getSinglePendingVerification);
router.get('/service-boys', adminServiceBoyController.getAllServiceBoys);
router.get('/service-boys/:id', adminServiceBoyController.getServiceBoysById);
router.patch('/service-boys/:id/verify', adminServiceBoyController.verifyServiceBoyByAdmin);
router.patch('/service-boys/:id/:status', adminServiceBoyController.updateServiceBoyStatus);


router.get('/vendors/verify', adminVendorController.getAllVendorPendingVerification);
router.get('/vendors/verify/:id', adminVendorController.getVendorSinglePendingVerification);
router.get('/vendors/:id', adminVendorController.getVendorById);
router.get('/vendors', adminVendorController.getAllVendors);
router.get('/vendors/verify/:id', adminVendorController.getVendorSinglePendingVerification);
router.patch('/vendors/:id/verify', adminVendorController.verifyVendorByAdmin);

export default router;