import express from 'express'
import { loginsql, registersql } from '../controller/sqlcontroller.js';



const router=express.Router();


router.post("/registersql",registersql);
router.post("/loginsql",loginsql);

export default router
