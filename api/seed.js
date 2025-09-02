const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user");
const Everest = require("./models/everest"); // adjust path if needed

// Villain users
const users = [
    {
    fullName: "David",
    email: "dave@dave.com",
    password: "dave",
    bio: "Just a dude who stumbled into destiny by accident. When he’s not perfecting sourdough, he’s mastering the art of staring contests with drying paint or adding yet another thimble to his oddly prestigious collection. A man of unusual hobbies, but impeccable timing.",

    },
];


const everests = [
  {
    name: "Everest",
    details: "I shall Make it to the summit. Not because it is easy, but because it is absurdly difficult, mildly dangerous, and will definitely justify all the thimbles I’ve collected as emergency crampons.",
    startDate: "01/01/01",
    endDate: "01/01/25",
    milestones: [
      { description: "Buy better boots", completed: false },
      { description: "Reach base camp and complain about the tea", completed: false },
      { description: "Accidentally get sponsored by a thimble company", completed: false },
      { description: "Summit attempt", completed: false }
    ],
    fullName: "David"
  },
  {
    name: "Master the Fine Art of Watching Paint Dry",
    details: "Some chase mountains, others chase dragons. I chase drying walls — a noble pursuit requiring patience, stillness, and the ability to argue with builders about primer coats.",
    startDate: "01/01/01",
    endDate: null,
    milestones: [
      { description: "Buy paint that claims to be 'quick-dry'", completed: false },
      { description: "Stare at wall for 3 hours straight without blinking", completed: false },
      { description: "Hold philosophical debate with self about beige vs. cream", completed: false },
      { description: "Document the entire process in a scrapbook", completed: false }
    ],
    fullName: "David"
  },
  {
    name: "Collect Every Thimble Known to Man",
    details: "While others are out skydiving or coding Kubernetes clusters, I am tracking down tiny hats for fingers — each one a symbol of my unstoppable commitment to unusual hobbies.",
    startDate: null,
    endDate: null,
    milestones: [
      { description: "Acquire a Victorian silver thimble", completed: false },
      { description: "Find a thimble shaped like a mountain", completed: false },
      { description: "Trade one rare thimble for another like a Pokémon master", completed: false },
      { description: "Curate world’s first thimble museum", completed: false }
    ],
    fullName: "David"
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");

    // Clear old data (dev only)
    await User.deleteMany({});
    await Everest.deleteMany({});
    console.log("Old users and everests removed");

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("Everest users seeded");


    // Create everests linked to the right user IDs
    const everestDocs = everests.map((everest) => {
      const author = createdUsers.find((f) => f.fullName === everest.fullName);
      return {
        name: everest.name,
        details: everest.details,
        startDate: everest.startDate,
        endDate: everest.endDate,
        milestones: everest.milestones,
        user: author._id
      };
    });

    await Everest.insertMany(everestDocs);
    console.log("everest everests seeded");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDB();