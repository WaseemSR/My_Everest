const Comment = require("../models/comment");
const Everest = require("../models/everest");
const { generateToken } = require("../lib/token");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// POST /comments
const createComment = async (req, res) => {
  try {
    const { content, everest } = req.body;

    if (!content || !everest) {
      return res.status(400).json({
        message: "Content and everest are required",
      });
    }

    // Check if Everest exists
    const existingEverest = await Everest.findById(everest);
    if (!existingEverest) {
      return res.status(404).json({
        message: "Everest not found",
      });
    }

    const comment = new Comment({
      content,
      author: req.user_id,
      everest,
    });

    await comment.save();
    const populated = await comment.populate("author", "fullName email");
    const newToken = generateToken(req.user_id);
    res.status(201).json({ comment: populated, token: newToken });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Error creating comment",
    });
  }
};

// GET /comments/everest/:everestId
const getCommentsByEverest = async (req, res) => {
  try {
    const { everestId } = req.params;

    if (!ObjectId.isValid(everestId)) {
      return res.status(400).json({ message: "Invalid everest ID" });
    }

    const comments = await Comment.find({ everest: everestId })
      .populate("author", "fullName email")
      .sort({ createdAt: 1 });

    const newToken = generateToken(req.user_id);
    res.status(200).json({
      comments,
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
    });
  }
};

// PUT /comments/:id
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user_id) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    comment.content = content;
    await comment.save();
    const populated = await comment.populate("author", "fullName email");
    const newToken = generateToken(req.user_id);
    res.status(200).json({ comment: populated, token: newToken });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment" });
  }
};

// DELETE /comments/:id
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user_id) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await Comment.findByIdAndDelete(id);

    const newToken = generateToken(req.user_id);
    res.status(200).json({ message: "Comment deleted successfully.", token: newToken });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment" });
  }
};

module.exports = {
  createComment,
  getCommentsByEverest,
  updateComment,
  deleteComment,
};
