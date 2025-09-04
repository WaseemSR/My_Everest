const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Everest = require("../../models/everest");
const User = require("../../models/user");
const EverestsController = require("../../controllers/everests");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
    return JWT.sign(
        {
        sub: userId,
        // Backdate this token of 5 minutes
        iat: Math.floor(Date.now() / 1000) - 5 * 60,
        // Set the JWT token to expire in 10 minutes
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        secret
    );
}

let token;
let user;
describe("/everests", () => {
    beforeAll(async () => {
        user = new User({
        email: "everest-test@test.com",
        password: "12345678",
        });
        await user.save();
        await Everest.deleteMany({});
        token = createToken(user.id);
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Everest.deleteMany({});
    });

    describe("POST, when a valid token is present", () => {
        test("responds with a 201", async () => {
        const response = await request(app)
            .post("/everests")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Everest" });
        expect(response.status).toBe(201);
        });

        test("creates a new everest", async () => {
        await request(app)
            .post("/everests")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Everest" });

        const everests = await Everest.find();
        expect(everests.length).toEqual(1);
        expect(everests[0].name).toEqual("Everest");
        });

        test("returns a new token", async () => {
        const testApp = request(app);
        const response = await testApp
            .post("/everests")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Everest" });

        const newToken = response.body.token;
        const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        });

        test("creates an everest with multiple milestones; missing 'completed' defaults to false", async () => {
        const payload = {
            name: "Climb a big hill",
            details: "I'm going to climb a massive hill",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            milestones: [
            { description: "buy boots" },
            { description: "book guide", completed: true },
            ],
        };

        const response = await request(app)
            .post("/everests")
            .set("Authorization", `Bearer ${token}`)
            .send(payload);

        expect(response.status).toBe(201);

        const saved = await Everest.findOne({
            user: user.id,
            name: "Climb a big hill",
        });
        expect(saved).toBeTruthy();
        expect(saved.milestones).toHaveLength(2);
        expect(saved.milestones[0].description).toEqual("buy boots");
        expect(saved.milestones[0].completed).toEqual(false);
        expect(saved.milestones[1].description).toEqual("book guide");
        expect(saved.milestones[1].completed).toEqual(true);
        });
    });

    describe("POST, when token is missing", () => {
        test("responds with a 401", async () => {
        const response = await request(app)
            .post("/everests")
            .send({ name: "Guitar" });

        expect(response.status).toEqual(401);
        });

        test("an everest is not created", async () => {
        await request(app).post("/everests").send({ name: "Guitar" });

        const everests = await Everest.find();
        expect(everests.length).toEqual(0);
        });

        test("a token is not returned", async () => {
        const response = await request(app)
            .post("/everests")
            .send({ name: "Guitar" });

        expect(response.body.token).toEqual(undefined);
        });
    });

    describe("GET, when token is present", () => {
        test("the response code is 200", async () => {
        const everest1 = new Everest({ name: "Guitar", user: user.id });
        const everest2 = new Everest({ name: "Everest", user: user.id });
        await everest1.save();
        await everest2.save();

        const response = await request(app)
            .get("/everests")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(200);
        });

        test("returns every everest in the collection", async () => {
        const everest1 = new Everest({ name: "Piano", user: user.id });
        const everest2 = new Everest({ name: "Surfing", user: user.id });
        await everest1.save();
        await everest2.save();

        const response = await request(app)
            .get("/everests")
            .set("Authorization", `Bearer ${token}`);

        const everests = response.body.everests;
        const firstEverest = everests[0];
        const secondEverest = everests[1];

        expect(firstEverest.name).toEqual("Piano");
        expect(secondEverest.name).toEqual("Surfing");
        });

        test("returns a new token", async () => {
        const everest1 = new Everest({ name: "Japan", user: user.id });
        const everest2 = new Everest({ name: "Karate", user: user.id });
        await everest1.save();
        await everest2.save();

        const response = await request(app)
            .get("/everests")
            .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        });
    });

    describe("GET, when token is missing", () => {
        test("the response code is 401", async () => {
        const everest1 = new Everest({ name: "Guitar", user: user.id });
        const everest2 = new Everest({ name: "Everest", user: user.id });
        await everest1.save();
        await everest2.save();

        const response = await request(app).get("/everests");

        expect(response.status).toEqual(401);
        });

        test("returns no everests", async () => {
        const everest1 = new Everest({ name: "Guitar", user: user.id });
        const everest2 = new Everest({ name: "Everest", user: user.id });
        await everest1.save();
        await everest2.save();

        const response = await request(app).get("/everests");

        expect(response.body.everests).toEqual(undefined);
        });

        test("does not return a new token", async () => {
        const everest1 = new Everest({ name: "Guitar", user: user.id });
        const everest2 = new Everest({ name: "Everest", user: user.id });
        await everest1.save();
        await everest2.save();

        const response = await request(app).get("/everests");

        expect(response.body.token).toEqual(undefined);
        });
    });

  // --- DELETE /everests/:id ---
    describe("DELETE, when token is present", () => {
        test("responds with a 200 and deletes the everest", async () => {
        const ev = await Everest.create({ name: "To delete", user: user.id });

        const response = await request(app)
            .delete(`/everests/${ev._id}`)
            .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Everest deleted" });

            const remaining = await Everest.findById(ev._id);
            expect(remaining).toBeNull();
        });

        test("responds with 400 for invalid id", async () => {
            const response = await request(app)
                .delete(`/everests/123`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Invalid Everest ID!" });
        });

        test("responds with 404 when the everest does not exist", async () => {
            const missingId = new Everest()._id.toString();
            const response = await request(app)
                .delete(`/everests/${missingId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Everest not found!" });
        });
    });
    // --- GET /everests/:id ---
    describe("GET by id, when token is present", () => {
    test("200: returns the specific everest and a new token", async () => {
        // Arrange: create one to fetch
        const ev = await Everest.create({
        name: "Find me",
        details: "Peekaboo",
        user: user.id,
        });

        // Act
        const response = await request(app)
        .get(`/everests/${ev._id}`)
        .set("Authorization", `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.everest).toBeDefined();
        expect(response.body.everest._id).toEqual(String(ev._id));
        expect(response.body.everest.name).toEqual("Find me");

        // token refresh check (same style as your other tests)
        const newToken = response.body.token;
        const newDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldDecoded = JWT.decode(token, process.env.JWT_SECRET);
        expect(newDecoded.iat > oldDecoded.iat).toBe(true);
    });

    test("400: invalid ObjectId returns error", async () => {
        const response = await request(app)
        .get("/everests/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid Everest ID" });
    });

    test("404: valid ObjectId but not found", async () => {
        const missingId = new Everest()._id.toString(); // valid, not saved
        const response = await request(app)
        .get(`/everests/${missingId}`)
        .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Everest not found" });
    });
    });

    describe("GET by id, when token is missing", () => {
    test("401: unauthorized", async () => {
        const ev = await Everest.create({ name: "Auth needed", user: user.id });

        const response = await request(app).get(`/everests/${ev._id}`);

        expect(response.status).toBe(401);
    });

    test("does not return a token or everest", async () => {
        const ev = await Everest.create({ name: "Still private", user: user.id });

        const response = await request(app).get(`/everests/${ev._id}`);

        expect(response.body.token).toBeUndefined();
        expect(response.body.everest).toBeUndefined();
    });
    });



    test("POST /everests → 400 when save fails (createEverest catch)", async () => {
        // keep logs quiet
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        // make the new Everest().save() blow up
        const saveSpy = jest
            .spyOn(Everest.prototype, "save")
            .mockRejectedValueOnce(new Error("Save failed"));

        const res = await request(app)
            .post("/everests")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Any Name" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Save failed" });

        saveSpy.mockRestore();
        consoleSpy.mockRestore();
        });

    test("getUserEverests → 500 when DB chain rejects (controller catch)", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const userId = new mongoose.Types.ObjectId().toString();

        // Mock the query chain: find(...).sort(...).populate(...)-> Promise.reject(...)
        const findSpy = jest.spyOn(Everest, "find").mockReturnValueOnce({
            sort: () => ({
            populate: () => Promise.reject(new Error("DB exploded")),
            }),
        });

        // Minimal mock req/res
        const req = { params: { userId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await EverestsController.getUserEverests(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "DB exploded" });

        findSpy.mockRestore();
        consoleSpy.mockRestore();
        });


});