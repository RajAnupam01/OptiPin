import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  pin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pin",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
