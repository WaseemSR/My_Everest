const express = require("express");
const UsersController = require("../controllers/users");
const EverestsController = require("../controllers/everests");
const router = express.Router();
const tokenChecker = require("../middleware/tokenChecker");


router.post("/", UsersController.create);
router.get("/profile", tokenChecker, UsersController.getProfile);
router.get("/:userId/everests", tokenChecker, EverestsController.getUserEverests);

module.exports = router;
