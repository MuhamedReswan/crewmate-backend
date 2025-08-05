import { Router } from "express";
import { container } from "tsyringe";
import { IAdminAuthController } from "../../controllers/v1/interfaces/admin/IAdminAuth.controller";


const router = Router();

router.use((req, res, next) => {
    console.log(`Incoming admin request: ${req.method} ${req.url}`);
    next();
  });

const adminAuthController = container.resolve<IAdminAuthController>('IAdminAuthController');

router.post('/login',adminAuthController.verifyLogin);
router.post('/logout',adminAuthController.adminLogout);

export default router;