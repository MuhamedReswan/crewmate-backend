import { Router } from "express";
import v1ServiceBoyRouter from "./v1/serviceBoy.router";

const router = Router();


router.use('api/auth/v1/service-boy',v1ServiceBoyRouter);


export default router;