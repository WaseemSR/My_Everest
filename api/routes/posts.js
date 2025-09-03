const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const PostsController = require("../controllers/posts");

// Multer setup for storing uploaded photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", PostsController.getAllPosts);
router.post("/", upload.single("photo"), PostsController.createPost);

module.exports = router;
