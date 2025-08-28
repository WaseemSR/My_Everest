const User = require("../models/user");

async function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const bio = req.body.bio;

  const existingEmail = await User.findOne({email});
  if (existingEmail) {
    console.log("Email is already in use.");
    return res.status(400).json({message: "Email is already in use. Try to sign up with another email or log in."})
  }

  const user = new User({ email, password, fullName, bio });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

  async function getProfile(req, res) {
    try {
      console.log("req.user_id from token: ", req.user_id)
      const user = await User.findById(req.user_id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found"});
      }
      res.json({ user });
      } catch (err) {
        console.error("getProfile eroor:", err);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
  }

const UsersController = {
  create: create,
  getProfile: getProfile
};

module.exports = UsersController;
