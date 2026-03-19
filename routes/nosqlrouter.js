import express from 'express'
import { loginnosql, registernosql } from '../controller/nosqlcontroller.js';

const router1=express.Router();

router1.post("/registernosql",registernosql);
router1.post("/loginnosql",loginnosql);

export default router1