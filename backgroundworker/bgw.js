import { sendmail } from "../mailsystem/sendmail.js";
import { taskqueue } from "./taskqueue.js";

taskqueue.process(async(job)=>{
    const{to,subject,text}=job.data;
    console.log("email processing.....")
    await sendmail(to,subject,text)
    console.log("email sended to the user")
})

