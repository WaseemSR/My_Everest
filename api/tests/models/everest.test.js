const mongoose = require("mongoose");
const Everest = require("../../models/everest");

describe("Everest model milestones", () => {
  test("defaults to an empty milestones array", () => {
    const everest = new Everest({ name: "Test", user: new mongoose.Types.ObjectId() });
    expect(Array.isArray(everest.milestones)).toBe(true);
    expect(everest.milestones.length).toBe(0);
  });

  test("milestone requires description and completed defaults to false", () => {
    const everest = new Everest({
      name: "Climb",
      user: new mongoose.Types.ObjectId(),
      milestones: [{ description: "buy boots" }],
    });

    const milestone = everest.milestones[0];
    expect(milestone.description).toBe("buy boots");
    expect(milestone.completed).toBe(false);
  });
});