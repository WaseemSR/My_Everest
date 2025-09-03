const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find();
    const token = generateToken(req.user_id);
    res.status(200).json({ posts: posts, token: token });
  } catch (error) {
    console.error("Failed to get posts:", error);
    res.status(500).json({ message: "Failed to get posts" });
  }
}

async function createPost(req, res) {
  try {
    const { message } = req.body;
    const userId = req.user_id;

    // Require at least a message or a photo
    if (!message?.trim() && !req.file) {
      return res.status(400).json({ message: "Message or photo is required" });
    }

    // Handle uploaded file
    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // Create the post
    const post = new Post({
      user: userId,
      message: message?.trim() || "",
      photoUrl,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      comments: [],
    });

    await post.save();

    const token = generateToken(userId);
    res.status(201).json({ message: "Post created", token, post });

  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
}

const PostsController = {
  getAllPosts,
  createPost,
};

module.exports = PostsController;

console.log("Post model:", Post);
