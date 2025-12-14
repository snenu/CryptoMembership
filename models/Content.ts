import mongoose, { Schema, models } from 'mongoose'

const ContentSchema = new Schema(
  {
    membershipId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    contentURI: {
      type: String,
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'video', 'file'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  }
)

export default models.Content || mongoose.model('Content', ContentSchema)


