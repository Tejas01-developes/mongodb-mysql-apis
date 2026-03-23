import { taskqueue } from "../backgroundworker/taskqueue.js";
import { getfilepathsqlquery, getrefreshinfo, insertrefreshsql, insertsqlfilequery, loginsqlquery, registerquerysql, updaterefreshsql } from "../service/sqlservices.js";
import bcrypt from 'bcrypt'
import { access, refreshh } from "../tokens/tokens.js";
import path from "path";
import fs from 'fs';
import mime from 'mime';

export const registersql = async (req, resp) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return resp.status(400).json({ success: false, message: "no body recived" })
    }
    const id = crypto.randomUUID()
    const hash = await bcrypt.hash(password, 10);
    try {
        const entry = await registerquerysql({ id, name, email, password: hash })

        resp.status(200).json({ success: true, message: "user registered succesfully" })
        await taskqueue.add({
            to: email,
            subject: "welcome email",
            text: `welcome to our service your userid is ${id}`
        })
        return
    } catch (err) {
        return resp.status(400).json({ success: false, message: "no user entered" })
    }
}




export const loginsql = async (req, resp) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return resp.status(400).json({ success: false, message: "no body recived" })
    }
    try {
        const getinfo = await loginsqlquery({ email })
        const compare = await bcrypt.compare(password,getinfo[0].password);
        if (!compare) {
            return resp.status(400).json({ success: false, messahe: "password is incorrect" })
        }
       
        const userid=getinfo[0].id;
        const accesstoken=access(userid);
        
        let refreshtkn;
        try{
        const findrefresh=await getrefreshinfo({id:userid})
        const now=Date.now();
        const refreshdate=findrefresh[0].expire_at;
        if(now > refreshdate){
            refreshtkn=refreshh(userid);
           
            const updatetkn=updaterefreshsql({refreshtkn})
        }else{
        refreshtkn=findrefresh[0].token;
        }

    } catch (err) {
       refreshtkn=refreshh(userid)
       const inserttoken=await insertrefreshsql({userid,token:refreshtkn})
    }

    resp.cookie("refresh",refreshtkn,{
        httpOnly:true,
        sameSite:true,
        secure:"Lax",
        path:"/"
    })
    return resp.status(200).json({success:true,message:"login succesfully done"})
    }catch(err){
        return resp.status(400).json({success:false,message:"refresh token process failed"})
    }
}


export const uploadfiledata=async(req,resp)=>{
    if(!req.file){
        return resp.status(400).json({success:false,message:"no file recived"})
    }
    const filename=req.file.filename;
    const folder=process.env.UPLOAD_FOLDER;
    const filepath=path.join(folder,filename)
    const mimetype=req.file.mimetype;
    console.log(mimetype);
    const userid=req.id.id
    try{
        const uploadquery=await insertsqlfilequery({userid,filename,fileurl:filepath})
        return resp.status(200).json({success:true,message:"file uploaded"})
    }catch(err){
    return resp.status(400).json({success:false,message:"file upload failed"})
    }
}


export const getfilesql=async(req,resp)=>{
    const userid=req.id.id;
    
    if(!userid){
        return resp.status(400).json({success:false,message:"token is not avalible"})
    }
    try{
        const getfilesinfo=await getfilepathsqlquery({userid});
       const filepath=getfilesinfo[0].fileurl;
       const finalfilepath=filepath.replace(/\\/g,"/");
       if(!fs.existsSync(finalfilepath)){
        return resp.status(400).json({success:false,message:"no file on this path"})
    }
        const mimetype=mime.getType(finalfilepath)
        resp.setHeader("Content-Type",mimetype)
    
       fs.createReadStream(finalfilepath).pipe(resp);
       

    }catch(err){
        return resp.status(400).json({success:false,message:"file info fetch failed"})
    }
}