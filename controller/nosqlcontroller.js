import { taskqueue } from "../backgroundworker/taskqueue.js";
import { findnosqlquery, findrefreshnosqlquery, insertrefreshnosql, registernosqlquery, updaterefreshnosql } from "../service/nosqlservices.js";
import bcrypt from 'bcrypt';
import { access, refreshh } from "../tokens/tokens.js";
import { ObjectId } from "mongodb";

export const registernosql = async (req, resp) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return resp.status(400).json({ success: false, message: "no body recived" })
    }
    try {
        const findemail = await findnosqlquery({ email })
        console.log(findemail);
        if (findemail) {
            return resp.status(400).json({ success: false, message: "email already registered" })
        }
        const hash = await bcrypt.hash(password, 10)
        const enternosql = await registernosqlquery({ name, email, password: hash })
        taskqueue.add({
            to: email,
            subject: "welcome email",
            text: "welcome to our service"
        })
        return resp.status(200).json({ success: true, message: "user entered" })
    } catch (err) {
        return resp.status(400).json({ success: false, message: "no user entered" })
    }
}


export const loginnosql = async (req, resp) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return resp.status(400).json({ success: false, message: "no body recived" })
    }
    try {
        const getinfo = await findnosqlquery({ email })
       
        const compare = await bcrypt.compare(password, getinfo.password);
        if (!compare) {
            return resp.status(400).json({ success: false, message: "password is incorrect" })
        }
        const id = getinfo._id.toString();
      
        const accesstkn = access(id);
        let refreshtkn;
        try {
            const seetokenexist = await findrefreshnosqlquery({id})
            const now = new Date();
            const refreshexpiry = seetokenexist.expire_at;
            if (now > refreshexpiry) {
                refreshtkn = refreshh(id)
                const updatequery = await updaterefreshnosql({ token: refreshtkn })
            } else {
                refreshtkn = seetokenexist.token
            }


        } catch (err) {
            refreshtkn = refreshh(id)
            const insertrefresh = await insertrefreshnosql({id, token: refreshtkn })
        }
        resp.cookie("refresh", refreshtkn, {
            httpOnly: true,
            sameSite: true,
            secure: "Lax",
            path: "/"
        })
        return resp.status(200).json({ success: true, message: "login succesfully done" })
    } catch (err) {
        return resp.status(400).json({ success: false, message: "login process failed" })
    }
}
