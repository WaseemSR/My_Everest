const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Everest = require("../../models/everest");
const User = require("../../models/user");

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

    // describe("POST, when a valid token is present", () => {
    //     test("responds with a 201", async () => {
    //     const response = await request(app)
    //         .post("/everests")
    //         .set("Authorization", `Bearer ${token}`)
    //         .send({ name: "Everest" });
    //     expect(response.status).toBe(201);
    //     });

    //     test("creates a new everest", async () => {
    //     await request(app)
    //         .post("/everests")
    //         .set("Authorization", `Bearer ${token}`)
    //         .send({ name: "Everest" });

    //     const everests = await Everest.find();
    //     expect(everests.length).toEqual(1);
    //     expect(everests[0].name).toEqual("Everest");
    //     });

    //     test("returns a new token", async () => {
    //     const testApp = request(app);
    //     const response = await testApp
    //         .post("/everests")
    //         .set("Authorization", `Bearer ${token}`)
    //         .send({ name: "Everest" });

    //     const newToken = response.body.token;
    //     const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
    //     const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

    //     // iat stands for issued at
    //     expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    //     });
    // });


    describe("POST, when token is missing", () => {
        test("responds with a 401", async () => {
        const response = await request(app)
            .post("/everests")
            .send({ name: "Guitar" });

        expect(response.status).toEqual(401);
        });

        test("an everest is not created", async () => {
        const response = await request(app)
            .post("/everests")
            .send({ name: "Guitar" });

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
        const everest1 = new Everest({ name: "Japan", user: user.id});
        const everest2 = new Everest({ name: "Karate", user: user.id });
        await everest1.save();
        await everest2.save();

        const response = await request(app)
            .get("/everests")
            .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

        // iat stands for issued at
        expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
        });
    });

    describe("GET, when token is missing", () => {
        test("the response code is 401", async () => {
        const everest1 = new Everest({ name: "Guitar", user: user.id });
        const everest2 = new Everest({ name: "Everest", user: user.id});
        await everest1.save();
        await everest2.save();

        const response = await request(app).get("/everests");

        expect(response.status).toEqual(401);
        });

        test("returns no everests", async () => {
        const everest1 = new Everest({ name: "Guitar", user: user.id});
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


});
