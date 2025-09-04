const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user");
const Everest = require("./models/everest"); // adjust path if needed

const users = [
  {
    fullName: "David Smith",
    email: "davesmith@davetheman.com",
    password: "dave",
    bio: "David is the sort of person who brings bread to a meeting and somehow leaves with three new friends and a database schema. He learned sourdough to fix his patience, then discovered it also fixes people’s moods. When he’s not troubleshooting flaky tests, he’s cataloging his growing thimble collection with a very serious tagging system. His superpower is breaking big problems into tiny, boring steps until they surrender. Favorite sound: the quiet click of a green build. Least favorite: the kettle when it’s empty.",
  },
  {
    fullName: "Priya Kapoor",
    email: "priya.kapoor@example.com",
    password: "password123",
    bio: "Priya approaches life like a careful refactor: change one thing, run the tests, celebrate with tea. She mentors newcomers by drawing diagrams on whatever surface is closest, including napkins and occasionally her own sleeve. She believes in humane standups, crisp commit messages, and feature flags as a love language. On weekends she experiments with chai blends and monitors CI pipelines for fun. If a meeting needs rescuing, she’ll turn requirements into bullet points before anyone notices. Her desk plant has three names and an alarming growth rate.",
  },
  {
    fullName: "Mateo Alvarez",
    email: "mateo.alvarez@example.com",
    password: "password123",
    bio: "Mateo automates chores out of pure principle. If he does anything twice, a script appears. He keeps a tidy spreadsheet for everything, including impulse buys and failed bread recipes. His playlists go from ambient focus to Latin dance without warning, miraculously improving sprint velocity. Teammates trust him to spot edge cases hiding in plain sight. He documents as he goes, then writes a friendlier version for future humans. Secret hobby: photographing interesting shadows on brutalist buildings and labeling them like API endpoints.",
  },
  {
    fullName: "Aisha Khan",
    email: "aisha.khan@example.com",
    password: "password123",
    bio: "Aisha organizes chaos with color, sticky notes, and a formidable backlog. She has a sixth sense for dependencies that were never mentioned but definitely exist. When design and engineering argue, she translates into both languages and sneaks in acceptance criteria while everyone nods. She schedules deep work like it’s a medical appointment and fiercely protects it. Outside work, she curates miniature museums inside shoeboxes, each with a story and a QR code. She collects small victories and celebrates them loudly.",
  },
  {
    fullName: "Ben Walker",
    email: "ben.walker@example.com",
    password: "password123",
    bio: "Ben is a coffee-to-commit converter with an allergy to flaky tests. He believes the best PRs are short, obvious, and a little boring. When confronted with weirdness, he reaches for logs, not vibes. He teaches git like a storytelling tool and swears by meaningful branch names. Lunch breaks involve slow walks, podcasts about cities, and a stubborn refusal to eat at his desk. He’s the teammate who quietly fixes the build before anyone else finishes complaining in Slack.",
  },
];


const everests = [
  // PRIYA KAPOOR — two mountain goals + one travel
  {
    name: "Snowdon Sunrise",
    details: "Beat the alarm, beat the clouds, and earn a smug flask of chai on the summit before tourists discover gradients.",
    startDate: "2025-03-15",
    endDate: "2025-09-30",
    milestones: [
      { description: "Book B&B in Llanberis and sunrise alarm plan", completed: true },
      { description: "Break in boots on two local hill walks", completed: true },
      { description: "Route study: Pyg up, Miners down; weather and bail points", completed: true },
      { description: "Pack list with headtorch, layers, and emergency tea", completed: false },
      { description: "Start pre-dawn, pace to the saddle without heroics", completed: false },
      { description: "Summit photo + celebratory chai, descend safely", completed: false },
      { description: "Log learnings and pick next peak", completed: false }
    ],
    fullName: "Priya Kapoor"
  },
  {
    name: "Helvellyn",
    details: "A gentle chat with exposure and a polite handshake with adrenaline. Diagram the ridge, then walk the diagram.",
    startDate: "2025-06-01",
    endDate: "2025-10-31",
    milestones: [
      { description: "Scramble practice on easy Grade 1 ridge locally", completed: false },
      { description: "Weather window watch + ‘no mist on edges’ rule", completed: false },
      { description: "Emergency nav refresher and GPX on phone + paper", completed: false },
      { description: "Pack microspikes if temps dip, gloves for grip", completed: false },
      { description: "Traverse Striding Edge steadily; avoid hero moves", completed: false },
      { description: "Summit Helvellyn; descend via Swirral Edge calmly", completed: false },
      { description: "Post-walk debrief over tea and cake", completed: false }
    ],
    fullName: "Priya Kapoor"
  },
  {
    name: "Tea Pilgrimage: Darjeeling",
    details: "Book a small, civilized chaos-break in the hills: tea gardens, quiet notebooks, and one perfect tasting flight.",
    startDate: "2025-10-01",
    endDate: "2025-11-30",
    milestones: [
      { description: "Pick dates, set budget, renew passport if needed", completed: false },
      { description: "Book flights + homestay near a tea estate", completed: false },
      { description: "Schedule two guided tastings and one sunrise ride", completed: false },
      { description: "Bring home leaves + notes for a chai experiment", completed: false }
    ],
    fullName: "Priya Kapoor"
  },

  // MATEO ALVAREZ — two mountain goals + one job
  {
    name: "Mount Teide Summit",
    details: "Automate nothing except sunscreen reapplication. Volcano, stars, spreadsheets of joy.",
    startDate: "2025-04-10",
    endDate: "2025-12-31",
    milestones: [
      { description: "Secure summit permit + cable car contingency plan", completed: true },
      { description: "Cardio plan: 6 weeks of hill intervals, logged", completed: true },
      { description: "Acclimatization hike the day before", completed: true },
      { description: "Pack list with headlamp, layers, 2L water, snacks", completed: true },
      { description: "Sunrise start; steady cadence; enjoy lunar terrain", completed: true },
      { description: "Summit, descend safely; record GPX and notes", completed: true }
    ],
    fullName: "Mateo Alvarez"
  },
  {
    name: "La Malinche Weekend Summit",
    details: "A tidy, friendly volcano to respect. Treat switchbacks like unit tests: pass them one by one.",
    startDate: "2025-05-01",
    endDate: "2025-10-31",
    milestones: [
      { description: "Book cabin near trailhead; early start plan", completed: false },
      { description: "Strength sessions: calves + core twice weekly", completed: false },
      { description: "Route study: treeline pace, summit push timing", completed: false },
      { description: "Hydration & snack schedule every 45 minutes", completed: false },
      { description: "Summit photo; descend before afternoon storms", completed: false },
      { description: "Write trip doc with tips for future Mateo", completed: false }
    ],
    fullName: "Mateo Alvarez"
  },
  {
    name: "Land an Automation Engineer Role",
    details: "Get paid to script the boring bits. Pipelines that purr, cron jobs that don’t bite.",
    startDate: "2025-02-15",
    endDate: "2025-11-30",
    milestones: [
      { description: "Polish CV + portfolio with two automation case studies", completed: true },
      { description: "Target companies; track apps in a spreadsheet (obviously)", completed: true },
      { description: "Build demo: ‘One-Click Infra Lint + Tests’", completed: false },
      { description: "5 mock interviews; collect feedback; iterate answers", completed: false },
      { description: "Apply weekly (min 5), follow up politely", completed: false },
      { description: "Negotiate offer; celebrate with tacos", completed: false }
    ],
    fullName: "Mateo Alvarez"
  },

  // AISHA KHAN — two mountain goals + one fear
  {
    name: "Jebel Toubkal Summit",
    details: "A well-managed ascent: dependencies identified, risks mitigated, satisfaction delivered at altitude.",
    startDate: "2025-09-01",
    endDate: "2026-03-31",
    milestones: [
      { description: "Flights to Marrakech + refuge booking", completed: true },
      { description: "Fitness plan: stair repeats + long weekend hikes", completed: true },
      { description: "Gear check: warm layers, hat, gloves, poles", completed: false },
      { description: "Acclimatization walk to Sidi Chamharouch", completed: false },
      { description: "Refuge overnight; early summit push timing", completed: false },
      { description: "Summit safely; group photo; controlled descent", completed: false },
      { description: "Retro notes: what went well, what to tweak", completed: false },
      { description: "Print tiny museum box about the trip (QR code included)", completed: false }
    ],
    fullName: "Aisha Khan"
  },
  {
    name: "Ben Macdui in Winter Conditions",
    details: "Calm navigation across a big, honest plateau. Forecasts read, bearings steady, snacks frequent.",
    startDate: "2025-12-01",
    endDate: "2026-03-31",
    milestones: [
      { description: "Winter skills course: axe arrest + crampon footwork", completed: false },
      { description: "Map & compass practice night; backup GPX loaded", completed: false },
      { description: "Check both MWIS and Met Office mountain forecasts", completed: false },
      { description: "Full winter kit packed; wind chill plan set", completed: false },
      { description: "Pick bluebird day; conservative route choice", completed: false },
      { description: "Summit and exit with plenty of daylight buffer", completed: false }
    ],
    fullName: "Aisha Khan"
  },
  {
    name: "Tame the Fear of Heights",
    details: "Turn ‘Nope’ into ‘Rope’. Controlled exposure, trusted systems, and the occasional victorious whoop.",
    startDate: "2025-09-15",
    endDate: "2025-12-31",
    milestones: [
      { description: "Book intro to lead course; learn clipping & falls", completed: true },
      { description: "Three practice sessions on easy routes", completed: true },
      { description: "Planned, safe fall with trusted belayer", completed: true },
      { description: "Lead a route one grade above comfort", completed: true },
      { description: "Reflect + write a tiny museum card about courage", completed: true }
    ],
    fullName: "Aisha Khan"
  },

  // BEN WALKER — two mountain goals + one instrument
  {
    name: "Scafell Pike",
    details: "Clean commits, clean lines: steady ascent, tidy descent, and a flask strong enough to refactor morale.",
    startDate: "2025-05-01",
    endDate: "2025-09-30",
    milestones: [
      { description: "Book Borrowdale stay; early parking plan", completed: true },
      { description: "Two shakedown hikes; fix any hotspot issues", completed: true },
      { description: "Route brief: Styhead to Corridor, summit timing", completed: true },
      { description: "Pack list: map, compass, layers, jelly babies", completed: true },
      { description: "Summit, descend before the grump hour", completed: false },
      { description: "Write trip report; share GPX with friends", completed: false }
    ],
    fullName: "Ben Walker"
  },
  {
    name: "Old Man of Coniston at Sunset",
    details: "Golden light, quiet paths, and a smug descent by headtorch. Minimal drama, maximum view.",
    startDate: "2025-07-01",
    endDate: "2025-10-31",
    milestones: [
      { description: "Pick clear-weather window; sunset time math", completed: false },
      { description: "Headtorch charged; spare batteries packed", completed: false },
      { description: "Steady climb, summit snack, careful descent", completed: false },
      { description: "Post-hike stretch and mercy on calves", completed: false }
    ],
    fullName: "Ben Walker"
  },
  {
    name: "Learn Drums ",
    details: "Turn footnotes into downbeats. From counting in Git commits to counting in fills—without breaking the build or the lease.",
    startDate: "2025-04-01",
    endDate: "2025-12-31",
    milestones: [
      { description: "Acquire practice pad + sticks; daily 10-minute habit", completed: true },
      { description: "Rudiments: singles, doubles, paradiddles to 120 BPM", completed: false },
      { description: "Learn 3 songs with steady timing (metronome)", completed: false },
      { description: "Record and post one tasteful groove", completed: false },
      { description: "Jam with a friend; celebrate with coffee not cymbals", completed: false }
    ],
    fullName: "Ben Walker"
  },
  {
    name: "Everest",
    details: "I shall Make it to the summit. Not because it is easy, but because it is absurdly difficult, mildly dangerous, and will definitely justify all the thimbles I’ve collected as emergency crampons.",
    startDate: "2001-01-01",
    endDate: "2025-01-01",
    milestones: [
      { description: "Buy better boots", completed: true },
      { description: "Reach base camp and complain about the tea", completed: true },
      { description: "Accidentally get sponsored by a thimble company", completed: true },
      { description: "Summit attempt", completed: true }
    ],
    fullName: "David Smith"
  },
  {
    name: "Master the Fine Art of Watching Paint Dry",
    details: "Some chase mountains, others chase dragons. I chase drying walls — a noble pursuit requiring patience, stillness, and the ability to argue with builders about primer coats.",
    startDate: "2001-01-01",
    endDate: null,
    milestones: [
      { description: "Buy paint that claims to be 'quick-dry'", completed: true },
      { description: "Stare at wall for 3 hours straight without blinking", completed: true },
      { description: "Hold philosophical debate with self about beige vs. cream", completed: true },
      { description: "Document the entire process in a scrapbook", completed: true }
    ],
    fullName: "David Smith"
  },
  {
    name: "Collect Every Thimble Known to Man",
    details: "While others are out skydiving or coding Kubernetes clusters, I am tracking down tiny hats for fingers — each one a symbol of my unstoppable commitment to unusual hobbies.",
    startDate: null,
    endDate: null,
    milestones: [
      { description: "Acquire a Victorian silver thimble", completed: true },
      { description: "Find a thimble shaped like a mountain", completed: true },
      { description: "Trade one rare thimble for another like a Pokémon master", completed: true },
      { description: "Curate world’s first thimble museum", completed: true }
    ],
    fullName: "David Smith"
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