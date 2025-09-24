const User = require("../models/user");

async function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const bio = req.body.bio;
  const profileImageUrl = req.body.profileImageUrl;

  const existingEmail = await User.findOne({email});
  if (existingEmail) {
    console.log("Email is already in use.");
    return res.status(400).json({message: "Email is already in use. Try to sign up with another email or log in."})
  }

  const user = new User({ email, password, username, bio, profileImageUrl, });
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
        console.error("getProfile error:", err);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
  }
  async function updateUser(req, res) {
    try{
        const { id } = req.params;

        const allowed = ["username", "bio", "profileImageUrl"];
        const updates = {};
            for (const field of allowed) {
                if (req.body[field] != null) updates[field] = req.body[field];
            }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No updateable fields"})
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { $set: updates }, 
            { new: true, runValidators: true, context: "query" }
        ).select("-password");

        if (!updated) {
            return res.status(404).json({ message: "User not found" })
        };

        return res.status(200).json({ message: "User updated", user: updated });
            } catch (err) {
              if (err && err.code === 11000) {
              return res.status(409).json({ message: "Username already in use" });
              }
              console.error("updateUser error:", err);
              return res.status(500).json({ message: "Server error" });
            }
}


const UsersController = {
  create: create,
  getProfile: getProfile,
  updateUser: updateUser
};

module.exports = UsersController;
