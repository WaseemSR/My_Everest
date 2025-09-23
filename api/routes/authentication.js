const express = require("express");
const router = express.Router();

const AuthenticationController = require("../controllers/authentication");

router.post("/", AuthenticationController.createToken);

router.get("/check-username", AuthenticationController.checkUsername);


module.exports = router;
