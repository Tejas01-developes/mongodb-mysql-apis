import express from 'express';
import { connectdb } from './dbconnections/mongodb_connect.js';
import router from './routes/sqlroutes.js';
import './backgroundworker/bgw.js';
import router1 from './routes/nosqlrouter.js';
import cookieParser from 'cookie-parser';
import redis from 'redis';
import { Server } from 'socket.io';
import http from 'http';

const app=express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const server=http.createServer(app);
export const io=new Server(server)
export const redisclient=redis.createClient();
redisclient.on("error",(err)=>{console.log("redis error",err)})
await redisclient.connect();
connectdb();
app.use("/apis",router)
app.use("/apiss",router1);

server.listen(3000,()=>{
    console.log("server started on the port 3000")
})

