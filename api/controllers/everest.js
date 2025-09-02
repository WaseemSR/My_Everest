const mongoose = require("mongoose");
const Everest = require("../models/Everest"); // Make sure this path is correct
const { generateToken } = require("../lib/token");

async function getAllEverests(req, res) {
    try {
        const everests = await Everest.find().populate("user", "fullName").sort({ createdAt: -1 });
        const token = generateToken(req.user_id);
        return res.status(200).json({ everests: everests, token: token });
    } catch (error) {
        console.error("Failed to get everests:", error);
        res.status(500).json({ message: "Failed to get everests" });
    }
}

async function createEverest(req, res) {
    try {
        // Handle uploaded file
        let photoUrl = null;
        if (req.file) {
            photoUrl = `/uploads/${req.file.filename}`; 

        // Create new Everest document
        const doc = new Everest({
            name: req.body.name,
            details: req.body.details,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            milestone: req.body.milestone,
            user: req.user_id, // From auth middleware
            photo: photoUrl // Make sure your schema supports this field
        });

        const saved = await doc.save();

        console.log("Saved Everest:", saved);
        console.log("req.user_id:", req.user_id);

        return res.status(201).json({ message: "Everest created", everest: saved });
    } catch (err) {
        console.error("createEverest error:", err);
        return res
            .status(400)
            .json({ message: err.message || "Failed to create Everest" });
    }
}

async function getUserEverests(req, res) {
    try {
        const userId = req.params.userId || req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const everests = await Everest
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "fullName");

        return res.status(200).json({ everests });
    } catch (err) {
        console.error("getUserEverests error:", err);
        return res.status(500).json({ message: err.message || "Failed to fetch user's Everests" });
    }
}

const EverestsController = {
    getAllEverests,
    createEverest,
    getUserEverests
};

module.exports = EverestsController;
