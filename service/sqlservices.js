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



export const getrefreshinfo=(data)=>{
    return new Promise((resolve,reject)=>{
        db.query(
            'select * from refresh where userid=?',
            [data.id],
            (err,res)=>{
                if(err){
                   return reject("error",err)
                }
                if(res.length === 0){
             return reject("null")
                }
               return resolve(res)
            }
        )
    })
       
    }



    export const insertrefreshsql=(data)=>{
        console.log("entered insert token service function")
       
        return new Promise((resolve,reject)=>{
            db.query(
                'insert into refresh (userid,token,added_at,expire_at) values (?,?,now(),date_add(now(),interval 7 day))',
                [data.userid,data.token],
                (err)=>{
                    if(err){
                       return reject("error",err)
                    }
                   
                   return resolve("success")
                }
            )
        })
           
        }
    


        
    export const updaterefreshsql=(data)=>{
        return new Promise((resolve,reject)=>{
            db.query(
                'update users set token=?,added_at=now(),expire_at=date_add(now(),interval 7 day)',
                [data.token],
                (err)=>{
                    if(err){
                       return reject("error",err)
                    }
                   
                   return resolve("update succesfully done")
                }
            )
        })
           
        }



export const insertsqlfilequery=(data)=>{
    return new Promise((resolve,reject)=>{
        db.query(
            'insert into filesfolders (userid,filename,fileurl) values (?,?,?)',
            [data.userid,data.filename,data.fileurl],
            (err)=>{
                if(err){
                    return reject("no file uploaded")
                }
                return resolve("uploaded")
            }
        )
    })
}        