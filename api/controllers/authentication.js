const User = require("../models/user");
const { generateToken } = require("../lib/token");

async function createToken(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("Auth Error: User not found");
    res.status(401).json({ message: "User not found" });
  } else if (user.password !== password) {
    console.log("Auth Error: Passwords do not match");
    res.status(401).json({ message: "Password incorrect" });
  } else {
    const token = generateToken(user.id);
    res.status(201).json({ token: token, message: "OK" });
  }
}

async function checkUsername(req, res) {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
    res.status(200).json({ exists: !!existingUser });
  } catch (err) {
    console.error("Username check failed:", err);
    res.status(500).json({ message: "Server error" });
  }
}

const AuthenticationController = {
  createToken,
  checkUsername,
};

module.exports = AuthenticationController;
