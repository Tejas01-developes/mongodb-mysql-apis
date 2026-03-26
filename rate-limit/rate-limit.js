import redis from 'redis';
import { redisclient } from '../app.js';

export const ratelimit=async(req,resp,next)=>{
    try{
    const email=req.body.email?.toLowerCase();
    const ip=req.ip;

    if(!email){
        return resp.status(400).json({success:false,message:"email not recived to control rate limit"})
    }
    const maxcount=5;
    const blocktime= 5 * 60;

    const ipkey=`login failed:ip ${ip}`;
    const emailkey=`login failed:email:${email}`;


    const ipattempts=await redisclient.incr(ipkey);
    if(ipattempts === 1){
        await redisclient.expire(ipkey,blocktime);
        
    }
    if(ipattempts > maxcount){
        return resp.status(429).json({success:false,message:"too many attempts"})
    }


    const emailattempts=redisclient.incr(emailkey);
    if(emailattempts === 1){
        await redisclient.expire(emailkey,blocktime);
    }

    if(emailattempts > maxcount){
        console.log(blocktime);
        return resp.status(429).json({success:false,message:"too many attempts"})
    }
    next();
}catch(err){
    console.error("error",err)
}
}