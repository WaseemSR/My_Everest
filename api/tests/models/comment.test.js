const mongoose = require("mongoose");
const Comment = require("../../models/comment");

describe("Comment model", () => {
  test("requires content, author, and everest", () => {
    const c = new Comment({});
    const err = c.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.content).toBeDefined();
    expect(err.errors.author).toBeDefined();
    expect(err.errors.everest).toBeDefined();
  });

  test("enforces content maxlength 1000", () => {
    const long = "x".repeat(1001);
    const c = new Comment({
      content: long,
      author: new mongoose.Types.ObjectId(),
      everest: new mongoose.Types.ObjectId(),
    });
    const err = c.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.content).toBeDefined();
  });

  test("valid with correct shape", () => {
    const c = new Comment({
      content: "Looks awesome!",
      author: new mongoose.Types.ObjectId(),
      everest: new mongoose.Types.ObjectId(),
    });
    const err = c.validateSync();
    expect(err).toBeUndefined();
  });
});
