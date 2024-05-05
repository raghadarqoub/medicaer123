import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import authRoute from "./Routes/auth.js";
import bookingRouter from "./Routes/booking.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRouter from "./Routes/review.js";
import userRoute from "./Routes/user.js";
import chatRouter from './Routes/chat.js';
import { initIo } from "./Utlis/server.js";
import { updateSocketId } from "./auth/verifyToken.js";



dotenv.config();
const app = express();
app.use(bodyParser.json());

const port=process.env.PORT ||8000;

// const corsOptions = {
//     origin: true
// } 
app.get("/" , (req,res)=>{
    res.send("Api is working");
})
// database connection
mongoose.set("strictQuery", false);
const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB database is connected");
    }
    catch(err){
        console.log('Mongo database connection is failed ',err);
    }
}
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors()); 
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/users",userRoute);
app.use("/api/v1/bookings",bookingRouter);
app.use("/api/v1/reviews",reviewRouter);
app.use("/api/v1/doctors",doctorRoute);
app.use("/api/v1/chats",chatRouter);

const server=app.listen(port,()=>{
    connectDB();
    console.log("server is running on port" +  port);
})
const io=initIo(server)
io.on('connection', socket => {
    console.log(socket.id, 'kkkk');

    socket.on('updateSocketId', async (data) => {
        try {
            const token = data.token;
            console.log(token);
            if (!token) {
                throw new Error("Token is missing");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (!decoded || !decoded.id) {
                throw new Error("Invalid token data");
            }

            const userId = decoded.id;
            await updateSocketId(userId, socket.id);
            socket.emit("updateSocketId", "Done");
        } catch (err) {
            console.error("Error updating socketId:", err);
            // Handle error response to client
            socket.emit("updateSocketIdError", { message: err.message });
        }
    });

    // Your other socket event handlers can go here

});
