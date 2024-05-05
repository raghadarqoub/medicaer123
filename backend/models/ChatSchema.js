import mongoose, { Types } from "mongoose";

const ChatSchema = new mongoose.Schema({
pOne:{type:Types.ObjectId},
pTwo:{type:Types.ObjectId},
messages:[{
    from:{type:Types.ObjectId},
    to:{type:Types.ObjectId},
    message:{type:String}
}]

},{
    timestamps:true
});

export default mongoose.model("Chat", ChatSchema);
