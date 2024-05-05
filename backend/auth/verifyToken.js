import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
    //get token from header
    const authToken = req?.headers?.authorization;
    //check if token exists
    if(!authToken || !authToken.startsWith("Bearer ")){
        
        return res
        ?.status(401)
        .json({success: false, message: "No Token ,Authorization Denied"});
    }
    try {
        const token = authToken.split(" ")[1];
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId=decoded.id;
       
        req.headers.role=decoded.role;
      
        next(); // must be call the next function 
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return res
            .status(401)
            .json({success: false, message: "Token Expired"});
        }
        return res
        .status(401)
        .json({success: false, message: "Invalid Token"});
    }
}
export const restrict = roles =>async(req,res,next)=>{
    const userId=req?.userId;
    let user;
    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);
    if(patient){
        user = patient;
    }
    if(doctor){
        user = doctor;
    }
    if(!roles.includes(user?.role)){
        return res.status(401).json({success: false , message: "You're not authorized"});
    }
    next();
}
export const updateSocketId = async (userId, socketId) => {
    try {
        const user = await User.findById(userId);
        if(user) {
            user.socketId = socketId;
            await user.save();
        } else {
            const doctor = await Doctor.findById(userId);
            if(doctor) {
                doctor.socketId = socketId;
                await doctor.save();
            }
        }
    } catch(err) {
        console.error("Error updating socketId:", err);
        // Handle error, possibly emit an error event or respond with an error message
    }
}
