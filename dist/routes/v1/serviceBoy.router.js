"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const express_1 = require("express");
const multer_1 = __importDefault(require("../../middleware/multer"));
const authorization_1 = require("../../middleware/authorization");
const router = (0, express_1.Router)();
const serviceBoyController = tsyringe_1.container.resolve('IServiceBoyController');
const eventController = tsyringe_1.container.resolve('IEventController');
const uploadFields = multer_1.default.fields([
    { name: "aadharImageFront", maxCount: 1 },
    { name: "aadharImageBack", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
]);
router.use(authorization_1.authMiddleware);
router.get('/profile/:id', serviceBoyController.loadProfile);
router.get('/works', eventController.getWorks);
router.get('/:id', serviceBoyController.loadServiceBoyById);
router.put('/profile', uploadFields, serviceBoyController.updateProfile);
router.patch('/retry-verify/:id', serviceBoyController.retryServiceBoyVerfication);
exports.default = router;
