import mongoose, { Schema, models } from 'mongoose'

const UserSchema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    isCreator: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default models.User || mongoose.model('User', UserSchema)


