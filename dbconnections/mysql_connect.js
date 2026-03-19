import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const db=mysql.createPool({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_ROOT,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
})