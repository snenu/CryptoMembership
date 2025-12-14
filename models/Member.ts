import mongoose, { Schema, models } from 'mongoose'

const MemberSchema = new Schema(
  {
    membershipId: {
      type: Number,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    tokenId: {
      type: Number,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient queries
MemberSchema.index({ membershipId: 1, walletAddress: 1 }, { unique: true })

export default models.Member || mongoose.model('Member', MemberSchema)


