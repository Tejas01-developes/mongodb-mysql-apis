import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';



export const entryschema=mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    }
},{Timestamp:true})

export const modell=mongoose.model("customers",entryschema);