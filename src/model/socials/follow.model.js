import mongoose from "mongoose"

const Schema = mongoose.Schema

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    following: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
})

followSchema.index({follower: 1, following: 1}, {unique: true})
followSchema.index({following: 1, createdAt: -1 })
followSchema.index({follower: 1, createdAt: -1 })

export default mongoose.model("Follow", followSchema)