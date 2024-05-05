import { getIo } from "../Utlis/server.js";
import Chat from "../models/ChatSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

// export const sendMessage=async(req,res,next)=>{
//     const{message ,destId}=req.body;

//     if(!destId){
// next(new Error("In-Valid user",{cause:400}))
//     }
//     const destUser=await User.findById(destId);
//     if (!destUser) {
//         return res.status(404).json({ message: "Destination user not found" });
//     }
//     const chat=await Chat.findOne({
//         $or:[
// {pOne:req.userId,pTwo:destId},
// {pOne:destId,pTwo:req.userId}
//         ]
//     }).populate([
//         {
//         path:"pOne"
//     },{
//         path:'pTwo'
//     }
// ])
// if(!chat){
//     const chat =await Chat.create({
//         pOne:req.userId,
//         pTwo:destId,
//         messages:[{
//             from:req.userId,
//             to:destId,
//             message
//         }]
//     })
//     getIo().to(destUser.socketId).emit('receiveMessage',message)
//     return res.status(201).json({message:"Done",chat})
// }
// chat.messages.push({
//     from:req.userId,
//     to:destId,
//     message
// })
// await chat.save()
// getIo().to(destUser.socketId).emit('receiveMessage',message)

// return res.status(200).json({message:"Done",chat})

// }


export const sendMessage = async (req, res, next) => {
    const { message, destId } = req.body;
    

    if (!destId) {
        return res.status(400).json({ message: "Invalid destination ID" });
    }
console.log(req.userId);
    let sender, receiver;
    // Check if the sender is a user or a doctor
    if (req.headers.role === 'patient') {


        sender = await User.findById(req.userId);
        receiver = await Doctor.findById(destId);
    } else if (req.headers.role === 'doctor') {
        sender = await Doctor.findById(req.userId);
        receiver = await User.findById(destId);
    } else {
        return res.status(400).json({ message: "Invalid role" });
    }

    if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
    }

    if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
    }

    const chat = await Chat.findOne({
        $or: [
            { pOne: req.userId, pTwo: destId },
           
           
        ]
        
    }).populate([
        {path:'pOne'},
        {path:'pTwo'}
    ])

    if (!chat) {
        const newChat = await Chat.create({
            pOne: req.userId,
            pTwo: destId,
            messages: [{
                from: req.userId,
                to: destId,
                message
            }]
        });
        getIo().to(receiver.socketId).emit('receiveMessage', message);
        return res.status(201).json({ message: "Done", chat: newChat });
    }

    chat.messages.push({
        from: req.userId,
        to: destId,
        message
    });
    await chat.save();
    getIo().to(receiver.socketId).emit('receiveMessage', message);

    return res.status(200).json({ message: "Done", chat });
};




export const getChat = async (req, res, next) => {
    const { destId } = req.params;
    console.log('Destination ID:', destId);
console.log('Request User ID:', req.userId); 
    try {
        // Find the chat document based on users' IDs
        const chat = await Chat.findOne({
            $or: [
                { pOne: req.userId, pTwo: destId },
                // { pOne: destId, pTwo: req.userId }
            ]
        }).populate([{path:'pOne'},{path:"pTwo"}]) // Populate pOne and pTwo fields with user/doctor data
  
       
        return res.status(200).json({ message: 'Done', chat });
    } catch (error) {
        // Handle errors
        console.error('Error fetching chat:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

