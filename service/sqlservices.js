import { db } from "../dbconnections/mysql_connect.js"

export const registerquerysql=(data)=>{
    return new Promise((resolve,reject)=>{
      
        db.query(
            'insert into users (id,name,email,password) values (?,?,?,?)',
            [data.id,data.name,data.email,data.password],
            (err)=>{
                if(err){
                 reject("no data entered")
                console.log("no data entered")
                return
            }
             resolve("user entered")
            console.log(" data entered")
            return
        }
        )
    })
}


export const loginsqlquery=(data)=>{
    return new Promise((resolve,reject)=>{
        db.query(
            'select * from users where email=?',
            [data.email],
            (err,res)=>{
                if(err){
                   reject(err)
                   console.log("db fetch error")
                }
                if(res.length === 0){
                    reject("no email is registered")
                }
                resolve(res)

            }
        )
    })
}