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

const UsersController = {
  create: create,
};

module.exports = UsersController;
