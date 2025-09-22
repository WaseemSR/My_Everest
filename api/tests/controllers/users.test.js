// const request = require("supertest");
// const mongoose = require("mongoose");

// const app = require("../../app");
// const User = require("../../models/user");
// const UsersController = require("../../controllers/users"); // for unit tests of getProfile

// require("../mongodb_helper");

// describe("/users", () => {
//   beforeEach(async () => {
//     await User.deleteMany({});
//   });

//   describe("POST, when email and password are provided", () => {
//     test("the response code is 201", async () => {
//       const response = await request(app)
//         .post("/users")
//         .send({ email: "poppy@email.com", password: "1234" });

//       expect(response.statusCode).toBe(201);
//       expect(response.body).toEqual({ message: "OK" });
//     });

//     test("a user is created", async () => {
//       await request(app)
//         .post("/users")
//         .send({ email: "scarconstt@email.com", password: "1234" });

//       const users = await User.find();
//       const newUser = users[users.length - 1];
//       expect(newUser.email).toEqual("scarconstt@email.com");
//     });

//     test("persists fullName and bio when provided", async () => {
//       await request(app)
//         .post("/users")
//         .send({
//           email: "flora@email.com",
//           password: "1234",
//           fullName: "Flora Poppy",
//           bio: "I like tests and tea."
//         });

//       const saved = await User.findOne({ email: "flora@email.com" }).lean();
//       expect(saved).toBeTruthy();
//       expect(saved.fullName).toBe("Flora Poppy");
//       expect(saved.bio).toBe("I like tests and tea.");
//       // Ensure password is stored (you'll swap to a hash later)
//       expect(saved.password).toBeTruthy();
//     });
//   });

//   describe("POST, when password is missing", () => {
//     test("response code is 400", async () => {
//       const response = await request(app)
//         .post("/users")
//         .send({ email: "skye@email.com" });

//       expect(response.statusCode).toBe(400);
//     });

//     test("does not create a user", async () => {
//       await request(app).post("/users").send({ email: "skye@email.com" });

//       const users = await User.find();
//       expect(users.length).toEqual(0);
//     });
//   });

//   describe("POST, when email is missing", () => {
//     test("response code is 400", async () => {
//       const response = await request(app)
//         .post("/users")
//         .send({ password: "1234" });

//       expect(response.statusCode).toBe(400);
//     });

//     test("does not create a user", async () => {
//       await request(app).post("/users").send({ password: "1234" });

//       const users = await User.find();
//       expect(users.length).toEqual(0);
//     });
//   });

//   describe("POST, when email already exists", () => {
//     test("returns 400 when email already exists", async () => {
//       // Arrange: create existing user
//       await new User({
//         email: "dup@email.com",
//         password: "abcd"
//       }).save();

//       // Act: attempt duplicate
//       const response = await request(app)
//         .post("/users")
//         .send({ email: "dup@email.com", password: "efgh" });

//       // Assert
//       expect(response.statusCode).toBe(400);
//       expect(response.body.message).toMatch(/Email is already in use/i);

//       // Still only one user
//       const count = await User.countDocuments({ email: "dup@email.com" });
//       expect(count).toBe(1);
//     });
//   });
// });

// //
// // Unit tests for getProfile (no JWT needed)
// //
// describe("UsersController.getProfile (unit)", () => {
//   beforeEach(async () => {
//     await User.deleteMany({});
//   });

//   test("200 + returns the user without password", async () => {
//     // Arrange: create a user
//     const doc = await new User({
//       email: "unit@test.com",
//       password: "shh",
//       fullName: "Unit Test",
//       bio: "Mocks rule."
//     }).save();

//     // Mock req/res
//     const req = { user_id: doc._id.toString() };
//     const json = jest.fn();
//     const status = jest.fn(() => ({ json }));
//     const res = { status, json };

//     // Act
//     await UsersController.getProfile(req, res);

//     // Assert
//     // getProfile uses res.json directly when successful (no res.status(200))
//     expect(status).not.toHaveBeenCalled(); // ensure no error path
//     expect(json).toHaveBeenCalledTimes(1);

//     const payload = json.mock.calls[0][0];
//     expect(payload).toHaveProperty("user");
//     expect(payload.user).toHaveProperty("_id");
//     expect(payload.user).toHaveProperty("email", "unit@test.com");
//     expect(payload.user.password).toBeUndefined();
//   });

//   test("404 when user not found", async () => {
//     const req = { user_id: new mongoose.Types.ObjectId().toString() };
//     const json = jest.fn();
//     const statusJson = jest.fn();
//     const status = jest.fn(() => ({ json: statusJson }));
//     const res = { status, json };

//     await UsersController.getProfile(req, res);

//     expect(status).toHaveBeenCalledWith(404);
//     expect(statusJson).toHaveBeenCalledWith({ message: "User not found" });
//   });

//     test("returns 500 when database query fails", async () => {
//       const spy = jest.spyOn(User, "findById").mockImplementation(() => {
//         return {
//           select: () => Promise.reject(new Error("kaboom"))
//         };
//       });

//       const req = { user_id: new mongoose.Types.ObjectId().toString() };
//       const statusJson = jest.fn();
//       const status = jest.fn(() => ({ json: statusJson }));
//       const res = { status };

//       await UsersController.getProfile(req, res);

//       expect(status).toHaveBeenCalledWith(500);
//       expect(statusJson).toHaveBeenCalledWith({ message: "Failed to fetch profile" });

//       spy.mockRestore();
//     });

// });