const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema({
        description: { type: String, required: true },
        completed: { type: Boolean, default: false }
}, { _id: true });

const EverestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: String,
    startDate: Date,
    endDate: Date,
    milestones: { type: [MilestoneSchema], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to creator
}, { timestamps: true });

const Everest = mongoose.model("Everest", EverestSchema);

module.exports = Everest;
