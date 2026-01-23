import { Router } from "express";
import { V1Router } from "./v1";

const router = Router();
router.use((req, res, next) => {
    console.log(`Incoming request Main: ${req.method} ${req.url}`);
    next();
  });

  router.use('/v1', V1Router);



export default router;