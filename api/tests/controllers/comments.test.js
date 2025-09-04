const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/user");
const Everest = require("../../models/everest");
const Comment = require("../../models/comment");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000) - 300,
      exp: Math.floor(Date.now() / 1000) + 600,
    },
    secret
  );
}

describe("/comments", () => {
  let user1, user2;
  let token1, token2;

  beforeAll(async () => {
    user1 = await new User({
      email: "author@test.com",
      password: "password",
      fullName: "Author One",
    }).save();

    user2 = await new User({
      email: "other@test.com",
      password: "password",
      fullName: "Other User",
    }).save();

    token1 = createToken(user1.id);
    token2 = createToken(user2.id);
  });

  afterEach(async () => {
    await Comment.deleteMany({});
    await Everest.deleteMany({});
    await User.deleteMany({});
  });

  describe("POST /comments", () => {
    test("creates a comment for an existing Everest, returns 201 and a refreshed token", async () => {
      const everest = await new Everest({
        name: "Climb Everest",
        user: user1._id,
      }).save();

      const res = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token1}`)
        .send({ content: "Great goal!", everest: everest._id.toString() });

      expect(res.status).toBe(201);
      expect(res.body.comment).toBeDefined();
      expect(res.body.comment.content).toBe("Great goal!");
      const returnedAuthor = res.body.comment.author;
      const returnedAuthorId =
        typeof returnedAuthor === "string" ? returnedAuthor : returnedAuthor?._id;
      expect(String(returnedAuthorId)).toEqual(String(user1._id));
      expect(String(res.body.comment.everest)).toEqual(String(everest._id));

      const newToken = res.body.token;
      const newTokenDecoded = JWT.decode(newToken, secret);
      const oldTokenDecoded = JWT.decode(token1, secret);
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toBe(true);
    });

    test("400 if content or everest is missing", async () => {
      const res1 = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token1}`)
        .send({ everest: "123" });
      expect(res1.status).toBe(400);

      const res2 = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token1}`)
        .send({ content: "No everest id" });
      expect(res2.status).toBe(400);
    });

    test("404 if the target Everest does not exist", async () => {
      const fakeId = "64b5b042d7f6024c352a0a22";
      const res = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token1}`)
        .send({ content: "Hello", everest: fakeId });

      expect(res.status).toBe(404);
    });

    test("401 if no token is provided", async () => {
      const everest = await new Everest({
        name: "No token Everest",
        user: user1._id,
      }).save();

      const res = await request(app)
        .post("/comments")
        .send({ content: "Hi", everest: everest._id.toString() });

      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
    });
  });

  describe("GET /comments/everest/:everestId", () => {
    test("returns comments for an Everest with 200 and refreshed token", async () => {
      const everest = await new Everest({
        name: "Goal",
        user: user1._id,
      }).save();

      await new Comment({
        content: "First!",
        author: user1._id,
        everest: everest._id,
      }).save();

      await new Comment({
        content: "Second!",
        author: user2._id,
        everest: everest._id,
      }).save();

      const res = await request(app)
        .get(`/comments/everest/${everest._id.toString()}`)
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.comments)).toBe(true);
      expect(res.body.comments.length).toBe(2);
      res.body.comments.forEach((c) =>
        expect(String(c.everest)).toEqual(String(everest._id))
      );

      const newToken = res.body.token;
      const newTokenDecoded = JWT.decode(newToken, secret);
      const oldTokenDecoded = JWT.decode(token1, secret);
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toBe(true);
    });

    test("400 for invalid ObjectId path param", async () => {
      const res = await request(app)
        .get("/comments/everest/not-a-valid-id")
        .set("Authorization", `Bearer ${token1}`);

      // Your controller uses ObjectId.isValid – expect 400
      expect(res.status).toBe(400);
    });

    test("401 if no token is provided", async () => {
      const res = await request(app).get("/comments/everest/64b5b042d7f6024c352a0a22");
      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
    });
  });

  describe("PUT /comments/:id", () => {
    test("author can edit their comment, returns 200 and refreshed token", async () => {
      const everest = await new Everest({ name: "Edit", user: user1._id }).save();
      const comment = await new Comment({
        content: "original",
        author: user1._id,
        everest: everest._id,
      }).save();

      const res = await request(app)
        .put(`/comments/${comment._id.toString()}`)
        .set("Authorization", `Bearer ${token1}`)
        .send({ content: "updated" });

      expect(res.status).toBe(200);
      expect(res.body.comment.content).toBe("updated");

      const newToken = res.body.token;
      const newTokenDecoded = JWT.decode(newToken, secret);
      const oldTokenDecoded = JWT.decode(token1, secret);
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toBe(true);
    });

    test("403 if a different user tries to edit", async () => {
      const everest = await new Everest({ name: "Edit2", user: user1._id }).save();
      const comment = await new Comment({
        content: "dont edit me",
        author: user1._id,
        everest: everest._id,
      }).save();

      const res = await request(app)
        .put(`/comments/${comment._id.toString()}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({ content: "hacked" });

      expect(res.status).toBe(403);
    });

    test("404 if comment not found", async () => {
      const res = await request(app)
        .put("/comments/64b5b042d7f6024c352a0a22")
        .set("Authorization", `Bearer ${token1}`)
        .send({ content: "nope" });

      expect(res.status).toBe(404);
    });

    test("400 for invalid comment id", async () => {
      const res = await request(app)
        .put("/comments/not-a-valid-id")
        .set("Authorization", `Bearer ${token1}`)
        .send({ content: "x" });

      expect(res.status).toBe(400);
    });

    test("401 if no token is provided", async () => {
      const res = await request(app)
        .put("/comments/64b5b042d7f6024c352a0a22")
        .send({ content: "x" });

      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
    });
  });

  describe("DELETE /comments/:id", () => {
    test("author can delete; returns 200 and actually removes the comment", async () => {
      const everest = await new Everest({ name: "Del", user: user1._id }).save();
      const comment = await new Comment({
        content: "bye",
        author: user1._id,
        everest: everest._id,
      }).save();

      const res = await request(app)
        .delete(`/comments/${comment._id.toString()}`)
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.success === true || typeof res.body.message === "string").toBe(true);

      const inDb = await Comment.findById(comment._id);
      expect(inDb).toBeNull();

      const newToken = res.body.token;
      const newTokenDecoded = JWT.decode(newToken, secret);
      const oldTokenDecoded = JWT.decode(token1, secret);
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toBe(true);
    });

    test("403 if a different user tries to delete", async () => {
      const everest = await new Everest({ name: "Del2", user: user1._id }).save();
      const comment = await new Comment({
        content: "dont delete me",
        author: user1._id,
        everest: everest._id,
      }).save();

      const res = await request(app)
        .delete(`/comments/${comment._id.toString()}`)
        .set("Authorization", `Bearer ${token2}`);

      expect(res.status).toBe(403);
    });

    test("404 if not found", async () => {
      const res = await request(app)
        .delete("/comments/64b5b042d7f6024c352a0a22")
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(404);
    });

    test("400 for invalid id", async () => {
      const res = await request(app)
        .delete("/comments/not-a-valid-id")
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(400);
    });

    test("401 if no token is provided", async () => {
      const res = await request(app).delete("/comments/64b5b042d7f6024c352a0a22");
      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
    });
  });
});
