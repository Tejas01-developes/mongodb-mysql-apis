import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

export const access=(id)=>{
    return jwt.sign(
        {id:id},
        process.env.ACCESS_KEY,
        {expiresIn:'10m'}
    )
}



export const refresh=(id)=>{
    return jwt.sign(
        {id:id},
        process.env.REFRESH_KEY,
        {expiresIn:'7d'}
    )
}