const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    everest: { type: mongoose.Schema.Types.ObjectId, ref: "Everest", required: true },
  },
  { timestamps: true } // gives createdAt
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;