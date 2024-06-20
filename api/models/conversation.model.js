import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    user1: {
      type: String,
      required: true,
    },
    user2: {
      type: String,
      required: true,
    },
    readByUser1: {
      type: Boolean,
      required: true,
    },
    readByUser2: {
      type: Boolean,
      required: true,
    },
    lastMessage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);