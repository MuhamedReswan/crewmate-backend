import { Router } from "express";
import { container } from "tsyringe";
import { ICommonController } from "../../controllers/v1/interfaces/common/ICommon.controller";

const commonController = container.resolve<ICommonController>('ICommonController');


const router = Router();

 router.get('/image-url/:key',commonController.streamImageByKey);

router.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "CrewMate API",
    env: process.env.NODEENV,
  });
});

export default router;