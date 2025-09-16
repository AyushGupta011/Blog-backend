import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import AuthRoute from './routes/AuthRoute.js';
import PostRoute from './routes/PostRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({origin:process.env.APP_BASE_URL||"http://localhost:5173",credentials:true}));


app.get("/",(req,res)=>{
    res.send("hello world!");
})

//routes
app.use("/api/auth", AuthRoute);
app.use("/api/posts", PostRoute);



app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
});





