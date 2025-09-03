const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/comments");

router.post("/", CommentsController.createComment);
router.get("/everest/:everestId", CommentsController.getCommentsByEverest);

module.exports = router;
