import express from 'express'
import { getfilesql, loginsql, registersql, uploadfiledata } from '../controller/sqlcontroller.js';
import { upload } from '../fileupload/fileupload.js';
import { cookiefilter } from '../tokenfilter/cookiefilter.js';



const router=express.Router();


router.post("/registersql",registersql);
router.post("/loginsql",loginsql);
router.post("/upload",upload.single("files"),cookiefilter,uploadfiledata);
router.get("/getfileinfo",cookiefilter,getfilesql);
export default router

