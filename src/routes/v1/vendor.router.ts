import { Router } from "express";
import { container } from "tsyringe";

import { IEventController } from "../../controllers/v1/interfaces/event/IEventController";
import { IVendorController } from "../../controllers/v1/interfaces/vendor/IVendor.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import upload from "../../middleware/multer.middleware";

const vendorController = container.resolve<IVendorController>("IVendorController");
const eventController = container.resolve<IEventController>("IEventController");

const router = Router();
const uploadFields = upload.fields([
  { name: "licenceImage", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

router.use(authMiddleware);

router.get("/profile/:id", vendorController.loadVendorProfile);
router.get("/:id", vendorController.loadVendorById);

router.put("/profile", uploadFields, vendorController.updateVendorProfile);
router.patch("/retry-verify/:id", vendorController.retryVendorVerfication);

router.get("/:vendorId/events", eventController.getEvents);

router.post("/events", eventController.createEvent);
router.patch("/events/:eventId", eventController.updateEvent);

router.patch("/events/:eventId/booking-status", eventController.changeBookingStatus);

export default router;
