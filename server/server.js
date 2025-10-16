import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import appointmentRouter from './routes/appointmentRoutes.js'


const app=express();
const port=5000
connectDB(); 
const allowedOrigins=['http://localhost:5173']

app.use(cors({origin:allowedOrigins,credentials:true}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//API Endpoints
app.get('/',(req,res)=>res.send("API Working"));
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/appointment', appointmentRouter)

app.listen(port,()=>{
console.log(`Server started on PORT:${port}`)
})
