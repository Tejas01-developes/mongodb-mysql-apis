import { taskqueue } from "../backgroundworker/taskqueue.js";
import { findnosqlquery, registernosqlquery } from "../service/nosqlservices.js";
import bcrypt from 'bcrypt';

export const registernosql=async(req,resp)=>{
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return resp.status(400).json({ success: false, message: "no body recived" })
    } 
try{
    const findemail=await findnosqlquery({email})
    console.log(findemail);
    if(findemail){
        return resp.status(400).json({success:false,message:"email already registered"})
    }
    const hash=await bcrypt.hash(password,10)
    const enternosql=await registernosqlquery({name, email, password:hash})
    taskqueue.add({
        to:email,
        subject:"welcome email",
        text:"welcome to our service"
    })
return resp.status(200).json({success:true,message:"user entered"})
}catch(err){
    return resp.status(400).json({success:false,message:"no user entered"})
}
}


export const loginnosql=async(req,resp)=>{
    const {email, password } = req.body;
    if (!email || !password) {
        return resp.status(400).json({ success: false, message: "no body recived" })
    } 
    try{
const getinfo=await findnosqlquery({email})
console.log("pass",getinfo.password);
const compare=await bcrypt.compare(password,getinfo.password);
if(!compare){
    return resp.status(400).json({success:false,message:"password is incorrect"})
}
return resp.status(200).json({ success: true, message: "login succesfull" })
    }catch(err){
        return resp.status(400).json({ success: false, message: "login process failed" })
    }
}