import { taskqueue } from "../backgroundworker/taskqueue.js";
import { loginsqlquery, registerquerysql } from "../service/sqlservices.js";
import bcrypt from 'bcrypt'

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
        return resp.status(200).json({ success: true, message: "login succesfull" })
    } catch (err) {
        return resp.status(400).json({ success: false, message: "login failed" })
    }

}