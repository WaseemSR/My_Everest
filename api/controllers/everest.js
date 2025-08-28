const Everest = require("../models/everest");
const { generateToken } = require("../lib/token");
const mongoose = require("mongoose");

async function getAllEverests(req, res) {
    const everests = await Everest.find();
    const token = generateToken(req.user_id);
    res.status(200).json({ everests: everests, token: token });
}

async function createEverest(req, res) {
    try {
        // Attach the creator from the token! (required by your schema)
        const doc = new Everest({
        name: req.body.name,
        details: req.body.details,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        milestone: req.body.milestone, // if you switch to [String], make sure frontend sends an array
        user: req.user_id,
        });

        await doc.save();
        return res.status(201).json({ message: "Everest created", everest: doc });
    } catch (err) {
        console.error("createEverest error:", err);
        return res
        .status(400)
        .json({ message: err.message || "Failed to create Everest" });
    }
}

async function getUserEverests(req, res) {
    try {
        const { id } = req.params;

        // Guard: valid ObjectId?
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
        }

        const everests = await Everest.find({ user: id }).sort({ createdAt: -1 });
        return res.status(200).json({ everests });
    } catch (err) {
        console.error("getUserEverests error:", err);
        return res
        .status(500)
        .json({ message: err.message || "Failed to fetch user's Everests" });
    }
}

const EverestsController = {
    getAllEverests: getAllEverests,
    createEverest: createEverest,
    getUserEverests: getUserEverests
};

module.exports = EverestsController;
