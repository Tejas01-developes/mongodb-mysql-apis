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
const entry=database.collection("customers").findOne({email:data.email},{projection: {password:1,_id:0,}})
if(!entry){
    return null
}
return entry
}catch(err){
    throw err
}
}
