import mongoose from "mongoose";


const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
      trim: true
    },
    lastName: {
      type: String,
      require: true,
      trim: true
    },
    email: {
      type: String,
      require: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      require: true,
    },
    country: {
      type: String,
    },
    phone: {
      type: String
    },

    //   level
    level: {
      amateur: {
        type:  Boolean,
        default: true
     },
      beginner: {
          type: Boolean,
          default: false
      },
      expert: {
          type: Boolean,
          default: false
      }
    },

    isVerified: {
      type: Boolean,
      default: false,
    },


    profilePicture: {
      type: String,
    },

    bio: {
      type: String,
    },
    starter: {
      onboard1: {
        type: Boolean,
        default: false
      },
      onboard2: {
        type: Boolean,
        default: false
      },
      onboard3: {
        type: Boolean,
        default: false
      },
      completed: {
        type: Boolean,
        default: false
      }
    },

    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.index({username: 1 })
userSchema.index({email: 1})
userSchema.index({firstName: 1})
userSchema.index({lastName: 1})
export default mongoose.model("User", userSchema);
