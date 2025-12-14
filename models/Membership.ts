import mongoose, { Schema, models } from 'mongoose'

const MembershipSchema = new Schema(
  {
    membershipId: {
      type: Number,
      required: true,
      unique: true,
    },
    creator: {
      type: String,
      required: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    expiryDuration: {
      type: Number, // in seconds
    },
    coverImage: {
      type: String,
    },
    metadataURI: {
      type: String,
    },
    category: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalMembers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default models.Membership || mongoose.model('Membership', MembershipSchema)


