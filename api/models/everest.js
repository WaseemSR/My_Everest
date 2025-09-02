const mongoose = require("mongoose");

const EverestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    details: String,
    startDate: Date,
    endDate: Date,
    milestone: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // link to creator
    },
    photo: {
      type: String, // Path or URL to uploaded photo
    },
  },
  { timestamps: true }
);

const Everest = mongoose.model("Everest", EverestSchema);

module.exports = Everest;
