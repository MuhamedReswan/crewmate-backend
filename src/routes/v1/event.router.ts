import { Router } from "express";
import { container } from "tsyringe";
import { IEventController } from "../../controllers/v1/interfaces/event/IEventController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { Role } from "../../constants/Role";

const router = Router()

const eventController = container.resolve<IEventController>('IEventController');


router.get("/events" ,authMiddleware, authorize(Role.SERVICE_BOY), eventController.getEvents)
router.post("/events", eventController.createEvent)