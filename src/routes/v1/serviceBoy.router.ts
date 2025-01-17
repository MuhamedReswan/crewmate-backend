import { Router } from "express";
import { container } from "tsyringe";
import { IServiceBoyController } from "../../controllers/v1/interfaces/IServiceBoyController";


const serviceBoyController = container.resolve<IServiceBoyController>('IServiceBoyController');
const router = Router();


router.post('/register',(req, res) => serviceBoyController.register(req,res));


export default router;