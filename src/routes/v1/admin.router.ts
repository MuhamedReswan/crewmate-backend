import { Router } from "express";
import { container } from "tsyringe";
import { IAdminController } from "../../controllers/v1/interfaces/admin/IAdminController";


const router = Router();

router.use((req, res, next) => {
    console.log(`Incoming admin request: ${req.method} ${req.url}`);
    next();
  });

const adminController = container.resolve<IAdminController>('IAdminController');

router.post('/login',adminController.verifyLogin);
router.post('/logout',adminController.adminLogout);

export default router;