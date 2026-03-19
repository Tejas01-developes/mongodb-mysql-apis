import express from 'express';
import { connectdb } from './dbconnections/mongodb_connect.js';
import router from './routes/sqlroutes.js';
import './backgroundworker/bgw.js';
import router1 from './routes/nosqlrouter.js';


const app=express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectdb();
app.use("/apis",router)
app.use("/apiss",router1);

app.listen(3000,()=>{
    console.log("server started on the port 3000")
})

