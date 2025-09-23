// require("../mongodb_helper");
// const User = require("../../models/user");

// describe("User model", () => {
//   beforeEach(async () => {
//     await User.deleteMany({});
//   });

//   it("has an email address", () => {
//     const user = new User({
//       email: "someone@example.com",
//       password: "password",
//     });
//     expect(user.email).toEqual("someone@example.com");
//   });

//   it("has a password", () => {
//     const user = new User({
//       email: "someone@example.com",
//       password: "password",
//     });
//     expect(user.password).toEqual("password");
//   });

//     it("has a username", () => {
//     const user = new User({
//       email: "someone@example.com",
//       password: "password",
//       username: "John Smith"
//     });
//     expect(user.username).toEqual("John Smith");
//   });

//       it("has a username", () => {
//     const user = new User({
//       email: "someone@example.com",
//       password: "password",
//       username: "John Smith",
//       bio: "A crazy person"
//     });
//     expect(user.bio).toEqual("A crazy person");
//   });

//   it("can list all users", async () => {
//     const users = await User.find();
//     expect(users).toEqual([]);
//   });

//   it("can save a user", async () => {
//     const user = new User({
//       email: "someone@example.com",
//       password: "password",
//       username: "John Smith",
//       bio: "A crazy person"
//     });

//     await user.save();
//     const users = await User.find();

//     expect(users[0].email).toEqual("someone@example.com");
//     expect(users[0].password).toEqual("password");
//     expect(users[0].username).toEqual("John Smith");
//     expect(users[0].bio).toEqual("A crazy person");
//   });
// });
