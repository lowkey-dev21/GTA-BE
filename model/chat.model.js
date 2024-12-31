import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      text: String,
      timeStamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Chat", chatSchema);
