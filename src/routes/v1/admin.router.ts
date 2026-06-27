import { Router } from "express";
import { container } from "tsyringe";
import { authMiddleware } from "../../middleware/auth.middleware";
import { IAdminVendorController } from "../../controllers/v1/interfaces/admin/IAdminVendor.controller";
import { IAdminServiceBoyController } from "../../controllers/v1/interfaces/admin/IAdminServiceBoy.controller";
import { IAdminUserManagementController } from "../../controllers/v1/interfaces/admin/IAdminUserManagement.controller";
import { Role } from "../../constants/Role";
import { UserType } from "../../constants/userType";

const router = Router();

const adminVendorController = container.resolve<IAdminVendorController>('IAdminVendorController');
const adminServiceBoyController = container.resolve<IAdminServiceBoyController>('IAdminServiceBoyController');


router.use(authMiddleware);


const adminUsermanagementController = container.resolve<IAdminUserManagementController>('IAdminUserManagementController');

router.get("/:userType/pending-verification",
    adminUsermanagementController.getAllPendingVerification);
router.get('/:userType/:id/verify', adminUsermanagementController.getSinglePendingVerification);
router.patch('/:userType/:id/verify', adminUsermanagementController.verifyUserByAdmin);
router.get('/:userType', adminUsermanagementController.getUsers);
router.get('/:userType/:id', adminUsermanagementController.getUserById);
router.patch('/:userType/:id/:status', adminUsermanagementController.updateUserStatus);




// router.get('/service-boys/verify', adminServiceBoyController.getAllServiceBoysPendingVerification);
// router.get('/service-boys/verify/:id', adminServiceBoyController.getSinglePendingVerification);
// router.get('/service-boys', adminServiceBoyController.getAllServiceBoys);
// router.get('/service-boys/:id', adminServiceBoyController.getServiceBoysById);
// router.patch('/service-boys/:id/verify', adminServiceBoyController.verifyServiceBoyByAdmin);
// router.patch('/service-boys/:id/:status', adminServiceBoyController.updateServiceBoyStatus);


// router.get('/vendors/verify', adminVendorController.getAllVendorPendingVerification);
// router.get('/vendors/verify/:id', adminVendorController.getVendorSinglePendingVerification);
// router.get('/vendors/:id', adminVendorController.getVendorById);
// router.get('/vendors', adminVendorController.getAllVendors);
// router.get('/vendors/verify/:id', adminVendorController.getVendorSinglePendingVerification);
// router.patch('/vendors/:id/verify', adminVendorController.verifyVendorByAdmin);
// router.patch('/vendors/:id/:status', adminVendorController.updateVendorStatus);






// router.patch(
//     "/vendors/:id/verify",
//     (req, res) => adminUserController.verifyUser(req, res, "vendor")
// );


export default router;