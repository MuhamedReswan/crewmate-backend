import { Router } from "express";
import { container } from "tsyringe";

import { Role } from "../../constants/Role";
import { IEventController } from "../../controllers/v1/interfaces/event/IEventController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();
