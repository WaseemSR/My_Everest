const Everest = require("../models/everest");
const { generateToken } = require("../lib/token");

async function getAllEverests(req, res) {
    const everests = await Everest.find();
    const token = generateToken(req.user_id);
    res.status(200).json({ everests: everests, token: token });
}

async function createEverest(req, res) {
    const everest = new Everest({
        name: req.body.name,
        details: req.body.details,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        milestone: req.body.milestone,
        user: req.user_id, // tie Everest to the logged-in user
    });
    await everest.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "Everest created", token: newToken });
}

const EverestsController = {
    getAllEverests: getAllEverests,
    createEverest: createEverest,
};

module.exports = EverestsController;
