const request = require("supertest");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../../app");
const Everest = require("../../models/everest");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

const createToken = (userId) =>
    JWT.sign(
        {
        sub: userId,
        iat: Math.floor(Date.now() / 1000) - 5 * 60,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        secret
    );

    describe("/everests milestones routes", () => {
    let user;
    let token;
    let everest;

    beforeEach(async () => {
        await User.deleteMany({});
        await Everest.deleteMany({});

        user = await User.create({
        email: "everest-test@test.com",
        password: "12345678", // assuming hashing is in middleware/model hook for real app
        fullName: "Test User",
        });
        token = createToken(user.id);

        everest = await Everest.create({
        name: "Test Everest",
        details: "Climb a thing",
        user: user._id,
        milestones: [{ description: "Pack boots", completed: false }],
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Everest.deleteMany({});
    });

    describe("POST /everests/:everestId/milestones (addMilestone)", () => {
        test("201 creates a milestone and returns it", async () => {
        const res = await request(app)
            .post(`/everests/${everest._id}/milestones`)
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "Reach base camp" })
            .expect(201);

        // shape
        expect(res.body).toHaveProperty("everestId", everest._id.toString());
        expect(res.body).toHaveProperty("milestone");
        expect(res.body.milestone).toMatchObject({
            description: "Reach base camp",
            completed: false,
        });
        expect(res.body.milestone._id).toBeDefined();

        // persisted?
        const fresh = await Everest.findById(everest._id);
        expect(fresh.milestones.some((m) => m.description === "Reach base camp")).toBe(
            true
        );
        });

        test("400 on invalid id or empty description", async () => {
        await request(app)
            .post(`/everests/badid/milestones`)
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "X" })
            .expect(400);

        await request(app)
            .post(`/everests/${everest._id}/milestones`)
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "   " })
            .expect(400);
        });

        test("404 when Everest not found", async () => {
        const missingId = new mongoose.Types.ObjectId().toString();
        await request(app)
            .post(`/everests/${missingId}/milestones`)
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "X" })
            .expect(404);
        });
    });

    describe("PATCH /everests/:everestId/milestones/:milestoneId (checkbox toggle)", () => {
        test("200 toggles completed and returns updated milestone", async () => {
        const mid = everest.milestones[0]._id.toString();

        const res = await request(app)
            .patch(`/everests/${everest._id}/milestones/${mid}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(res.body).toEqual({
            milestone: {
            _id: mid,
            description: "Pack boots",
            completed: true, // flipped from false
            },
            everestId: everest._id.toString(),
        });

        const fresh = await Everest.findById(everest._id);
        const updated = fresh.milestones.id(mid);
        expect(updated.completed).toBe(true);
        });

        test("400 when ids are invalid", async () => {
        await request(app)
            .patch(`/everests/badid/milestones/also-bad`)
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        });

        test("404 when Everest not found", async () => {
        const missing = new mongoose.Types.ObjectId().toString();
        await request(app)
            .patch(`/everests/${missing}/milestones/${missing}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        });

        test("404 when milestone not found", async () => {
        const missingMid = new mongoose.Types.ObjectId().toString();
        await request(app)
            .patch(`/everests/${everest._id}/milestones/${missingMid}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        });
    });
});