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
    photo: {
      type: String, // Path or URL to uploaded photo
    },

    milestones: { type: [MilestoneSchema], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to creator
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

EverestSchema.index({ createdAt: -1 });
const Everest = mongoose.model("Everest", EverestSchema);

module.exports = Everest;
