const Comment = require("../models/comment");
const Everest = require("../models/everest");
const { generateToken } = require("../lib/token");

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

    const newToken = generateToken(req.user_id);
    res.status(201).json({
      comment,
      token: newToken,
    });
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

    if (!everestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid everest ID",
      });
    }

    const comments = await Comment.find({ everest: everestId })
      .populate("author", "email")
      .sort({ createdAt: 1 }); // oldest first (Acebook style)

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

module.exports = {
  createComment,
  getCommentsByEverest,
};
