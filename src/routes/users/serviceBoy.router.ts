import { Router } from "express";


const router = Router();


router.post('/register',(req, res) => serviceBoy.controller.register(req,res));