require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/myeverestdb";

async function seed() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding");

    // Create a test user
    const testUser = new User({
      email: "test@example.com",
      password: "password123", // For real apps: hash this!
      fullName: "Test User",
      bio: "This is a seeded test user.",
    });

    // Save user to DB
    await testUser.save();
    console.log("Test user created");

    // Disconnect after seeding
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

seed();
