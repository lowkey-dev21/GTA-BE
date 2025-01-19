// followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
// following: [{ type: Schema.Types.ObjectId, ref: "User" }],
// mates: [{ type: Schema.Types.Object, ref: "User" }],

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: " "
    },
    bio: {
        type: String,
    },

    verified: {
        type: Boolean,
        default: false,
    },

    followers: [{ type: Schema.Types.ObjectId, ref: "SocialsUser" }],
    following: [{ type: Schema.Types.ObjectId, ref: "SocialsUser" }],
    mates: [{ type: Schema.Types.Object, ref: "User" }],
},{timestamps: true});

export default mongoose.model("SocialsUser", userSchema)