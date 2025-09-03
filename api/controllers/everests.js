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
        const doc = new Everest({
            name: req.body.name,
            details: req.body.details,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            milestones: req.body.milestones,
            user: req.user_id, // tie Everest to the logged-in user
        });

        const saved = await doc.save();
        const token = generateToken(req.user_id);
        return res.status(201).json({ message: "Everest created", token: token, everest: saved });
    } catch (err) {
        console.error("createEverest error:", err);
        return res.status(400).json({ message: err.message || "Failed to create Everest" });
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

async function getEverestById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Everest ID" });
        }

        const everest = await Everest.findById(id);
        if (!everest) {
        return res.status(404).json({ message: "Everest not found" });
        }

        const token = generateToken(req.user_id);
        res.status(200).json({ everest, token });
    } catch (err) {
        console.error("getEverestById error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteEverest(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid Everest ID!"});
        }

        const deleted = await Everest.findByIdAndDelete(id);
        if(!deleted) {
            return res.status(404).json({message: "Everest not found!"});
        } 

        res.status(200).json({ message: "Everest deleted" });
        } catch (err) {
        console.error("deleteEverest error:", err);
        res.status(500).json({ message: "Server error" });
    }
}


const EverestsController = {
    getAllEverests: getAllEverests,
    createEverest: createEverest,
    getUserEverests: getUserEverests,
    getEverestById: getEverestById,
    deleteEverest: deleteEverest,
};

module.exports = EverestsController;
