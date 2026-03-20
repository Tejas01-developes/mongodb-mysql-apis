import { database } from "../dbconnections/mongodb_connect.js"
import { modell } from "../nosql_schema/schema.js"




export const registernosqlquery=async(data)=>{
    console.log({name:data.name,email:data.email,password:data.password})
try{
const entry=database.collection("customers").insertOne({name:data.name,email:data.email,password:data.password})

return "success"
}catch(err){
    throw err
}
}



export const findnosqlquery=async(data)=>{
   
try{
const entry=database.collection("customers").findOne({email:data.email},{projection: {password:1}})
if(!entry){
    return null
}
return entry
}catch(err){
    throw err
}
}


export const findrefreshnosqlquery=async(data)=>{
   
    try{
    const entry=database.collection("refresh").findOne({userid:data.id},{projection: {add_at:1,expire_at:1,token:1}})
    if(!entry){
        return null
    }
    return entry
    }catch(err){
        throw err
    }
    }
    

    export const insertrefreshnosql=async(data)=>{
       
    try{
    const entry=database.collection("refresh").insertOne({userid:data.id,token:data.token,added_at:new Date(),expire_at:new Date( Date.now() + 7 * 24 * 60 * 60 * 1000)})
    
    return "success"
    }catch(err){
        throw err
    }
    }


      export const updaterefreshnosql=async(data)=>{
       
    try{
    const entry=database.collection("refresh").updateOne({token:data.token,added_at:new Date(),expire_at:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
    
    return "update succesfully done"
    }catch(err){
        throw err
    }
    }