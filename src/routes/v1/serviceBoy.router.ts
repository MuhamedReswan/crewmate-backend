import { Router } from "express";
import { container } from "tsyringe";

import { IEventController } from "../../controllers/v1/interfaces/event/IEventController";
import { IServiceBoyController } from "../../controllers/v1/interfaces/serviceBoy/IServiceBoy.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import upload from "../../middleware/multer.middleware";

const router = Router();
const serviceBoyController = container.resolve<IServiceBoyController>("IServiceBoyController");
const eventController = container.resolve<IEventController>("IEventController");

const uploadFields = upload.fields([
  { name: "aadharImageFront", maxCount: 1 },
  { name: "aadharImageBack", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

router.use(authMiddleware);

router.get("/profile/:id", serviceBoyController.loadProfile);
// router.get('/events',eventController
//   .getWorks);
router.get("/:id", serviceBoyController.loadServiceBoyById);

router.put("/profile", uploadFields, serviceBoyController.updateProfile);
router.patch("/retry-verify/:id", serviceBoyController.retryServiceBoyVerfication);

export default router;
