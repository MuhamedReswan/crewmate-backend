import { Router } from "express";
import { container } from "tsyringe";
import { ICommonController } from "../../controllers/v1/interfaces/common/ICommon.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { Role } from "../../constants/Role";
import { IEventController } from "../../controllers/v1/interfaces/event/IEventController";
import { HttpStatusCode } from "../../constants/httpStatusCode";

const commonController = container.resolve<ICommonController>('ICommonController');
const eventController = container.resolve<IEventController>('IEventController');

const router = Router();



router.get("/events" ,authMiddleware, authorize(Role.VENDOR,Role.SERVICE_BOY), eventController.getEvents)
router.post("/events",authMiddleware, authorize(Role.VENDOR), eventController.createEvent);

router.get('/image-url/:key',commonController.streamImageByKey);
router.get(
  "/documents/:publicId",
  authMiddleware, 
  commonController.getSecureDocumentUrl
);

router.get("/health-check", (req, res) => {
  res.status(HttpStatusCode.OK).json({
    status: "ok",
    service: "CrewMate API",
    env: process.env.NODEENV,
    
  });
});

export default router;