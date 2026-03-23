import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();


export const cookiefilter=async(req,resp,next)=>{

    const tokenn=req.cookies.refresh;
    if(!tokenn){
        return resp.status(400).json({success:false,message:"token is not avalible"})
    }

     jwt.verify(tokenn,process.env.REFRESH_KEY,(err,decode)=>{
        if(err){
            return resp.status(400).json({success:false,message:"token is not correct"})
        }
        req.id=decode
        console.log(req.id.id);
        next();
    })

}