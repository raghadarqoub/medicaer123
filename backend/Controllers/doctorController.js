
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const updateDoctor = async (req, res) => {
    const id = req.params.id;

    try {
    const updateDoctor = await Doctor.findByIdAndUpdate(id, {$set:req.body}, { new: true });
        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updateDoctor,
        });
    } catch (error) {
        res.status(500).json({ success: false, message:"Failed to update" ,error });
        }
};
export const deleteDoctor = async (req, res) => {
    const id = req.params.id;

    try {
    await Doctor.findByIdAndDelete(id,);
        res.status(200).json({
            success: true,
            message: "Successfully delete",
            
        });
    } catch (error) {
        res.status(500).json({ success: false, message:"Failed to delete" ,error });
        }
};
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;
    try {
    const doctor = await Doctor.findById(id)
    .populate("reviews")
    .select("-password");
        res.status(200).json({
            success: true,
            message: "Doctor found",
            data: doctor,
        });
    } catch (error) {
        res.status(404).json({ success: false, message:"No doctor found" ,error });
        }
};
export const getAllDoctor = async (req, res) => {
    try {
        const {query}=req.query;
        let doctors;
        if(query){
            doctors = await Doctor.find({
                isApproved:'approved',
            $or:[
                {name:{$regex:query,$options:'i'}},
                {specialization:{$regex:query,$options:'i'}}
            ]
            }).select("-password");
        }else{
                doctors = await Doctor.find({ isApproved:'approved'}).select("-password");
        }
        res.status(200).json({
            success: true,
            message: "Users found",
            data: doctors,
        });
    } catch (error) {
        res.status(404).json({ success: false, message:"Not found" ,error });
        }
};

export const getDoctorProfile = async (req, res) => {
    const doctorId =req.userId ;
    try {
        const doctor =await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    const { password, ...rest} = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });
    res.status(200).json({
        success: true,
        message: "Profile info is getting", 
        data:{ ...rest, appointments},
    })
}catch (err) {
        res.status(500).json({ success: false, message: "Somthing went wrong ,cannot get" });
    }
}
// Assuming you have an Express app set up with routes

export const getPatientBooked = async (req, res) => {
    try {
        const { doctorId } = req.params;
    
        // Check if the doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
    
        // Query bookings with the specified doctorId
        const bookings = await Booking.find({ doctor: doctorId }).populate('user');
    
        // Extract unique user IDs from bookings
        const uniquePatientIds = [...new Set(bookings.map(booking => booking.user))];
    
        // Fetch user information for unique patient IDs
        const patients = await User.find({ _id: { $in: uniquePatientIds } });
    
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

