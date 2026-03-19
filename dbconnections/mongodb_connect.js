import mongodb, { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const client=new MongoClient(process.env.NOSQL_LINK);

let database;
export const connectdb=async()=>{
   
    try{
        await client.connect();
        database=client.db(process.env.NOSQL_DB)
        console.log("mongo db connected")
    }catch(err){
        throw err
    }
}

export {database}