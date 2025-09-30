const Everest = require("../models/everest");
const { generateToken } = require("../lib/token");
const mongoose = require("mongoose");

async function getAllEverests(req, res) {
    const everests = await Everest.find().populate("user", "username bio").sort({ createdAt: -1, _id: -1 });
    const token = generateToken(req.user_id);
    res.status(200).json({ everests: everests, token: token });
}

async function createEverest(req, res) {
  try {
    // Extract all relevant fields from req.body
    const { name, details, startDate, endDate, milestones, everestImageUrl } = req.body;

    // Create new Everest document
    const doc = new Everest({
      name,
      details,
      startDate,
      endDate,
      milestones,
      user: req.user_id, // tie Everest to logged-in user
      everestImageUrl: everestImageUrl || null, // use URL from frontend
    });

    const saved = await doc.save();

    const token = generateToken(req.user_id);
    return res.status(201).json({
      message: "Everest created",
      token,
      everest: saved,
    });
  } catch (err) {
    console.error("createEverest error:", err);
    return res.status(400).json({
      message: err.message || "Failed to create Everest",
    });
  }
}

async function updateEverest(req, res) {
    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid Everest ID"})
        }

        const allowed = ["name", "details", "startDate", "endDate", "everestImageUrl"];
        const updates = {};
            for (const field of allowed) {
                if (field in req.body) updates[field] = req.body[field];
            }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No updateable fields"})
        }

        const updated = await Everest.findByIdAndUpdate(
            { _id: id, user: req.user_id },
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Everest not found" })
        };

        return res.status(200).json({ message: "Everest updated", everest: updated });
            } catch (err) {
                console.error("updateEverest error:", err);
                return res.status(500).json({ message: "Server error" });
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
            .populate("user", "username");

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

        const everest = await Everest.findById(id).populate("user", "username bio");;
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

async function checkbox(req, res) {
    try {
        const { everestId, milestoneId } = req.params;

        if (
        !mongoose.Types.ObjectId.isValid(everestId) ||
        !mongoose.Types.ObjectId.isValid(milestoneId)
        ) {
        return res.status(400).json({ message: "Invalid Everest or Milestone ID" });
        }

        // 2) Load Everest doc
        const everest = await Everest.findOne({ _id: everestId, user: req.user_id });
        if (!everest) {
        return res.status(404).json({ message: "Everest not found" });
        }


        // 4) Find the milestone
        const milestone = everest.milestones.id(milestoneId);
        if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
        }

        // 5) Toggle + save
        milestone.completed = !milestone.completed;
        await everest.save();


        return res.status(200).json({
        milestone: {
            _id: milestone._id,
            description: milestone.description,
            date: milestone.date,
            completed: milestone.completed,
        },
        everestId: everest._id,
        });
    } catch (err) {
        console.error("toggle milestone error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

async function addMilestone(req, res) {
    try {
        const { everestId } = req.params;
        const { description, date } = req.body;

        // Validate inputs
        if (!mongoose.Types.ObjectId.isValid(everestId) || !description || description.trim() === "") {
        return res.status(400).json({ message: "Invalid Everest ID or description" });
        }

        // Load parent Everest
        const everest = await Everest.findOne({ _id: everestId, user: req.user_id });
        if (!everest) {
        return res.status(404).json({ message: "Everest not found" });
        }

        // Create + save new milestone
        everest.milestones.push({ description: description.trim(), date, completed: false });
        await everest.save();

        // Return just the new milestone (nicer for the client)
        const newMilestone = everest.milestones[everest.milestones.length - 1];
        return res.status(201).json({ milestone: newMilestone, everestId: everest._id });
    } catch (err) {
        console.error("addMilestone error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

const EverestsController = {
    getAllEverests: getAllEverests,
    
    createEverest: createEverest,
    updateEverest: updateEverest,
    getUserEverests: getUserEverests,
    getEverestById: getEverestById,
    deleteEverest: deleteEverest,
    checkbox: checkbox,
    addMilestone: addMilestone
};

module.exports = EverestsController;
