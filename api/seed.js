const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user");
const Everest = require("./models/everest"); // adjust path if needed

const users = [
  {
    username: "David Smith",
    email: "davesmith@davetheman.com",
    password: "dave",
    bio: "David is the sort of person who brings bread to a meeting and somehow leaves with three new friends and a database schema. He learned sourdough to fix his patience, then discovered it also fixes people’s moods. When he’s not troubleshooting flaky tests, he’s cataloging his growing thimble collection with a very serious tagging system. His superpower is breaking big problems into tiny, boring steps until they surrender. Favorite sound: the quiet click of a green build. Least favorite: the kettle when it’s empty."
  },
  {
    username: "Priya Kapoor",
    email: "priya.kapoor@example.com",
    password: "password123",
    bio: "I treat big goals like mountains: one steady step, a good plan, and tea in the flask. I’m happiest turning vague ideas into clear checklists and nudging friends over the start line. If there’s a view at the end and a slice of cake on the way down, I’m in."
  },
  {
    username: "Mateo Alvarez",
    email: "mateo.alvarez@example.com",
    password: "password123",
    bio: "If I do anything twice, I automate it. I log hikes like pull requests and write trip reports like READMEs. My guilty pleasure is documenting things beautifully so future-me says thanks."
  },
  {
    username: "Aisha Khan",
    email: "aisha.khan@example.com",
    password: "password123",
    bio: "I organize chaos for sport: color, labels, and a ruthless backlog. I like high places, tidy plans, and the moment a scary thing becomes a doable sequence."
  },
  {
    username: "Ben Walker",
    email: "ben.walker@example.com",
    password: "password123",
    bio: "I’m a coffee-to-commit converter who believes small, boring improvements win the day. Outdoors is my reset button; drums are my metronome for life."
  },
  {
    username: "Amira Khan",
    email: "amira.khan@example.com",
    password: "password123",
    bio: "I’m a beginner at many things on purpose. I like picking a hard thing and proving I can stick with it—one chord, one kilometre, one page at a time."
  },
  {
    username: "Lucas White",
    email: "lucas.white@example.com",
    password: "password123",
    bio: "I plan trips like sprints and meals like experiments. I love a tidy itinerary, a messy ramen bowl, and learning just enough to be dangerous in a kitchen."
  },
  {
    username: "Sophia Rossi",
    email: "sophia.rossi@example.com",
    password: "password123",
    bio: "I chase stories and skies. I write drafts, edit ruthlessly, and rearrange trips around the aurora forecast like a responsible chaos gremlin."
  },
  {
    username: "Chloe Mitchell",
    email: "chloe.mitchell@example.com",
    password: "password123",
    bio: "I run long distances and cut my podcasts even shorter. I like goals with finish lines and projects with publish buttons."
  },
  {
    username: "Hassan Ali",
    email: "hassan.ali@example.com",
    password: "password123",
    bio: "I automate my money and my learning. I like clean dashboards, tidy code, and progress you can graph."
  },
  {
    username: "Emily Zhang",
    email: "emily.zhang@example.com",
    password: "password123",
    bio: "I balance big hills with quiet weekends. Minimal gear, clean lines, and time to think—on paper or on a ridge."
  }
];

const everests = [
  // --- DAVE (unchanged, as requested) ---
  {
    name: "Everest",
    details: "I shall Make it to the summit. Not because it is easy, but because it is absurdly difficult, mildly dangerous, and will definitely justify all the thimbles I’ve collected as emergency crampons.",
    startDate: "2001-01-01",
    endDate: "2025-01-01",
    milestones: [
      { description: "Buy better boots", date: "2001-02-01", completed: true },
      { description: "Reach base camp and complain about the tea", date: "2001-03-01", completed: true },
      { description: "Accidentally get sponsored by a thimble company", date: "2001-04-01", completed: true },
      { description: "Summit attempt", date: "2025-01-01", completed: true }
    ],

    username: "David Smith",
    everestImageUrl: "/everest_images/everest.png"

  },
  {
    name: "Master the Fine Art of Watching Paint Dry",
    details: "Some chase mountains, others chase dragons. I chase drying walls — a noble pursuit requiring patience, stillness, and the ability to argue with builders about primer coats.",
    startDate: "2001-01-01",
    endDate: null,
    milestones: [
      { description: "Buy paint that claims to be 'quick-dry'", date: "2001-01-15", completed: true },
      { description: "Stare at wall for 3 hours straight without blinking", date: "2001-01-20", completed: true },
      { description: "Hold philosophical debate with self about beige vs. cream", date: "2001-01-25", completed: true },
      { description: "Document the entire process in a scrapbook", date: "2001-02-01", completed: true }
    ],

    username: "David Smith",
    everestImageUrl: "/everest_images/paint_dry.png"

  },
  {
    name: "Collect Every Thimble Known to Man",
    details: "While others are out skydiving or coding Kubernetes clusters, I am tracking down tiny hats for fingers — each one a symbol of my unstoppable commitment to unusual hobbies.",
    startDate: null,
    endDate: null,
    milestones: [
      { description: "Acquire a Victorian silver thimble", date: "2003-03-01", completed: true },
      { description: "Find a thimble shaped like a mountain", date: "2004-05-05", completed: true },
      { description: "Trade one rare thimble for another like a Pokémon master", date: "2005-07-07", completed: true },
      { description: "Curate world’s first thimble museum", date: "2008-09-09", completed: true }
    ],

    username: "David Smith",
    everestImageUrl: "/everest_images/thimbles.png"

  },

  // --- PRIYA ---
  {
    name: "Snowdon Sunrise",
    details: "A dawn ascent for headspace and a reminder that hard starts pay off.",
    startDate: "2025-03-15",
    endDate: "2025-09-30",
    milestones: [
      { description: "Book B&B in Llanberis and sunrise alarm plan", date: "2025-03-20", completed: true },
      { description: "Break in boots on two local hill walks", date: "2025-04-05", completed: true },
      { description: "Route study: Pyg up, Miners down; weather and bail points", date: "2025-04-12", completed: true },
      { description: "Pack list with headtorch, layers, and emergency tea", date: "2025-05-01", completed: false },
      { description: "Start pre-dawn, pace to the saddle without heroics", date: "2025-06-10", completed: false },
      { description: "Summit photo + celebratory chai, descend safely", date: "2025-06-10", completed: false },
      { description: "Log learnings and pick next peak", date: "2025-06-12", completed: false }
    ],
    username: "Priya Kapoor",
    everestImageUrl: "/everest_images/snowdon.png"
  },
  {
    name: "Helvellyn",
    details: "I want to practice steady confidence on edges, not speed; it’s about calm feet and good judgement.",
    startDate: "2025-06-01",
    endDate: "2025-10-31",
    milestones: [
      { description: "Scramble practice on easy Grade 1 ridge locally", date: "2025-06-15", completed: false },
      { description: "Weather window watch + ‘no mist on edges’ rule", date: "2025-07-01", completed: false },
      { description: "Emergency nav refresher and GPX on phone + paper", date: "2025-07-05", completed: false },
      { description: "Pack microspikes if temps dip, gloves for grip", date: "2025-09-15", completed: false },
      { description: "Traverse Striding Edge steadily; avoid hero moves", date: "2025-09-25", completed: false },
      { description: "Summit Helvellyn; descend via Swirral Edge calmly", date: "2025-09-25", completed: false },
      { description: "Post-walk debrief over tea and cake", date: "2025-09-26", completed: false }
    ],
    username: "Priya Kapoor",
    everestImageUrl: "/everest_images/helvellyn.png"
  },
  {
    name: "Tea Pilgrimage: Darjeeling",
    details: "Because tea is my ritual—this trip is my reward for showing up consistently.",
    startDate: "2025-10-01",
    endDate: "2025-11-30",
    milestones: [
      { description: "Pick dates, set budget, renew passport if needed", date: "2025-10-05", completed: false },
      { description: "Book flights + homestay near a tea estate", date: "2025-10-12", completed: false },
      { description: "Schedule two guided tastings and one sunrise ride", date: "2025-11-05", completed: false },
      { description: "Bring home leaves + notes for a chai experiment", date: "2025-11-25", completed: false }
    ],
    username: "Priya Kapoor",
    everestImageUrl: "/everest_images/tea.png"
  },

  // --- MATEO ---
  {
    name: "Mount Teide Summit",
    details: "Volcano at sunrise because I want a memory that outlasts my to-do lists.",
    startDate: "2025-04-10",
    endDate: "2025-12-31",
    milestones: [
      { description: "Secure summit permit + cable car contingency plan", date: "2025-04-20", completed: true },
      { description: "Cardio plan: 6 weeks of hill intervals, logged", date: "2025-05-31", completed: true },
      { description: "Acclimatization hike the day before", date: "2025-06-14", completed: true },
      { description: "Pack list with headlamp, layers, 2L water, snacks", date: "2025-06-15", completed: true },
      { description: "Sunrise start; steady cadence; enjoy lunar terrain", date: "2025-06-16", completed: true },
      { description: "Summit, descend safely; record GPX and notes", date: "2025-06-16", completed: true }
    ],
    username: "Mateo Alvarez",
    everestImageUrl: "/everest_images/teide.png"
  },
  {
    name: "La Malinche Weekend Summit",
    details: "A tidy, friendly volcano to respect—practice pacing and planning.",
    startDate: "2025-05-01",
    endDate: "2025-10-31",
    milestones: [
      { description: "Book cabin near trailhead; early start plan", date: "2025-07-05", completed: false },
      { description: "Strength sessions: calves + core twice weekly", date: "2025-07-20", completed: false },
      { description: "Route study: treeline pace, summit push timing", date: "2025-08-05", completed: false },
      { description: "Hydration & snack schedule every 45 minutes", date: "2025-08-20", completed: false },
      { description: "Summit photo; descend before afternoon storms", date: "2025-09-15", completed: false },
      { description: "Write trip doc with tips for future Mateo", date: "2025-09-20", completed: false }
    ],
    username: "Mateo Alvarez",
    everestImageUrl: "/everest_images/malinche.png"
  },
  {
    name: "Land an Automation Engineer Role",
    details: "Because I want my day job to be making boring things disappear.",
    startDate: "2025-02-15",
    endDate: "2025-11-30",
    milestones: [
      { description: "Polish CV + portfolio with two automation case studies", date: "2025-03-10", completed: true },
      { description: "Target companies; track apps in a spreadsheet", date: "2025-03-20", completed: true },
      { description: "Build demo: ‘One-Click Infra Lint + Tests’", date: "2025-04-25", completed: false },
      { description: "5 mock interviews; collect feedback; iterate answers", date: "2025-06-01", completed: false },
      { description: "Apply weekly (min 5), follow up politely", date: "2025-07-01", completed: false },
      { description: "Negotiate offer; celebrate with tacos", date: "2025-10-15", completed: false }
    ],
    username: "Mateo Alvarez"
  },

  // --- AISHA ---
  {
    name: "Jebel Toubkal Summit",
    details: "I want a well-run adventure to prove planning makes courage easier.",
    startDate: "2025-09-01",
    endDate: "2026-03-31",
    milestones: [
      { description: "Flights to Marrakech + refuge booking", date: "2025-10-01", completed: true },
      { description: "Fitness plan: stair repeats + long weekend hikes", date: "2025-11-01", completed: true },
      { description: "Gear check: warm layers, hat, gloves, poles", date: "2025-12-05", completed: false },
      { description: "Acclimatization walk to Sidi Chamharouch", date: "2026-01-05", completed: false },
      { description: "Refuge overnight; early summit push timing", date: "2026-02-10", completed: false },
      { description: "Summit safely; group photo; controlled descent", date: "2026-02-11", completed: false },
      { description: "Retro notes: what went well, what to tweak", date: "2026-02-15", completed: false }
    ],
    username: "Aisha Khan",
    everestImageUrl: "/everest_images/jebel_toubkal.png"
  },
  {
    name: "Ben Macdui in Winter Conditions",
    details: "Because winter skills make me calmer everywhere else in life.",
    startDate: "2025-12-01",
    endDate: "2026-03-31",
    milestones: [
      { description: "Winter skills course: axe arrest + crampon footwork", date: "2025-12-15", completed: false },
      { description: "Map & compass practice night; backup GPX loaded", date: "2026-01-05", completed: false },
      { description: "Check MWIS and Met Office mountain forecasts", date: "2026-01-10", completed: false },
      { description: "Full winter kit packed; wind chill plan set", date: "2026-02-01", completed: false },
      { description: "Pick bluebird day; conservative route choice", date: "2026-02-20", completed: false },
      { description: "Summit and exit with daylight buffer", date: "2026-02-21", completed: false }
    ],
    username: "Aisha Khan",
    everestImageUrl: "/everest_images/ben_macdui.png"
  },
  {
    name: "Tame the Fear of Heights",
    details: "I want my body to trust what my brain knows: the system is safe.",
    startDate: "2025-09-15",
    endDate: "2025-12-31",
    milestones: [
      { description: "Intro to lead course; learn clipping & falls", date: "2025-09-20", completed: true },
      { description: "Three practice sessions on easy routes", date: "2025-10-05", completed: true },
      { description: "Planned, safe fall with trusted belayer", date: "2025-10-20", completed: true },
      { description: "Lead a route one grade above comfort", date: "2025-11-15", completed: true },
      { description: "Reflect and write a courage note", date: "2025-12-05", completed: true }
    ],
    username: "Aisha Khan",
    everestImageUrl: "/everest_images/heights.png"
  },

  // --- BEN WALKER ---
  {
    name: "Scafell Pike",
    details: "Because tidy routes and tidy minds go together.",
    startDate: "2025-05-01",
    endDate: "2025-09-30",
    milestones: [
      { description: "Book Borrowdale stay; early parking plan", date: "2025-05-10", completed: true },
      { description: "Two shakedown hikes; fix any hotspot issues", date: "2025-05-25", completed: true },
      { description: "Route brief: Styhead to Corridor, summit timing", date: "2025-06-10", completed: true },
      { description: "Pack list: map, compass, layers, jelly babies", date: "2025-06-20", completed: true },
      { description: "Summit, descend before the grump hour", date: "2025-07-05", completed: false },
      { description: "Write trip report; share GPX with friends", date: "2025-07-07", completed: false }
    ],
    username: "Ben Walker",
    everestImageUrl: "/everest_images/scafell_pike.png"
  },
  {
    name: "Old Man of Coniston at Sunset",
    details: "Golden light and a careful headtorch descent—proof I can pace joy.",
    startDate: "2025-07-01",
    endDate: "2025-10-31",
    milestones: [
      { description: "Pick clear-weather window; sunset time math", date: "2025-08-05", completed: false },
      { description: "Headtorch charged; spare batteries packed", date: "2025-08-10", completed: false },
      { description: "Steady climb, summit snack, careful descent", date: "2025-08-20", completed: false },
      { description: "Post-hike stretch and calf mercy", date: "2025-08-21", completed: false }
    ],
    username: "Ben Walker"
  },
  {
    name: "Learn Drums",
    details: "I want better rhythm in everything, not just music.",
    startDate: "2025-04-01",
    endDate: "2025-12-31",
    milestones: [
      { description: "Practice pad + sticks; daily 10-minute habit", date: "2025-04-05", completed: true },
      { description: "Rudiments to 120 BPM (singles, doubles, paradiddles)", date: "2025-06-01", completed: false },
      { description: "Learn 3 songs with steady timing (metronome)", date: "2025-08-15", completed: false },
      { description: "Record one tasteful groove", date: "2025-09-10", completed: false },
      { description: "Jam with a friend", date: "2025-10-05", completed: false }
    ],
    username: "Ben Walker",
    everestImageUrl: "/everest_images/drums.png"
  },

  // --- AMIRA ---
  {
    name: "Run a Half Marathon",
    details: "I want to prove discipline beats talent—one week at a time.",
    startDate: "2025-02-01",
    endDate: "2025-05-31",
    milestones: [
      { description: "Train 3x per week with a plan", date: "2025-02-15", completed: false },
      { description: "Reach 10km comfortably", date: "2025-04-10", completed: false },
      { description: "Book a local half marathon", date: "2025-04-20", completed: false },
      { description: "Complete race in under 2h30", date: "2025-05-31", completed: false }
    ],

    username: "Amira Khan",
    everestImageUrl: "/everest_images/marathon.png"

  },
  {
    name: "Learn Guitar",
    details: "Campfire test: can I play one song people actually recognize?",
    startDate: "2025-01-10",
    endDate: "2025-12-01",
    milestones: [
      { description: "Buy acoustic guitar", date: "2025-01-15", completed: true },
      { description: "Learn 5 basic chords", date: "2025-03-01", completed: false },
      { description: "Play first full song", date: "2025-06-15", completed: false },
      { description: "Perform for friends", date: "2025-09-01", completed: false }
    ],

    username: "Amira Khan",
    everestImageUrl: "/everest_images/guitar.png"

  },
  {
    name: "Parkrun 5K PB",
    details: "Because I want a simple, repeatable way to measure progress.",
    startDate: "2025-03-01",
    endDate: "2025-08-31",

    milestones: [
      { description: "Run parkrun baseline time", date: "2025-03-10", completed: false },
      { description: "Intervals once per week", date: "2025-04-05", completed: false },
      { description: "Break PB by 30 seconds", date: "2025-06-15", completed: false },
      { description: "Break PB by 1 minute", date: "2025-08-15", completed: false }
    ],
    username: "Amira Khan"
  },

  // --- LUCAS ---
  {
    name: "Travel to Japan",
    details: "I’ve wanted to do this since I was a kid staring at photos of Tokyo trains.",
    startDate: "2025-06-01",
    endDate: "2025-07-15",
    milestones: [
      { description: "Save £2000", date: "2025-05-01", completed: false },
      { description: "Book flights + hotels", date: "2025-05-10", completed: false },
      { description: "Visit Tsukiji Market", date: "2025-06-10", completed: false },
      { description: "See Fushimi Inari shrine", date: "2025-06-20", completed: false }
    ],
    username: "Lucas White",
    everestImageUrl: "/everest_images/japan.png"
  },
  {
    name: "Learn to Cook 10 Recipes",
    details: "Cooking better is how I’ll save money and make friends well fed.",
    startDate: "2025-02-01",
    endDate: "2025-09-30",
    milestones: [
      { description: "Master knife skills basics", date: "2025-02-20", completed: false },
      { description: "Cook 5 meals for friends", date: "2025-05-01", completed: false },
      { description: "Document 10 recipes in a journal", date: "2025-09-01", completed: false }
    ],
    username: "Lucas White",
    everestImageUrl: "/everest_images/learn_cook.png"
  },
  {
    name: "Cycle London to Brighton",
    details: "A friendly challenge to make my commute legs do something interesting.",
    startDate: "2025-04-01",
    endDate: "2025-07-01",
    milestones: [
      { description: "Long ride 40km", date: "2025-04-20", completed: false },
      { description: "Long ride 60km", date: "2025-05-25", completed: false },
      { description: "Hills session—Ditchling practice", date: "2025-06-15", completed: false },
      { description: "Complete London–Brighton", date: "2025-06-30", completed: false }
    ],
    username: "Lucas White"
  },

  // --- SOPHIA ---
  {
    name: "See the Northern Lights",
    details: "Because I want a memory that looks like magic and feels like quiet.",
    startDate: "2025-11-01",
    endDate: "2026-02-28",
    milestones: [
      { description: "Research best locations (Iceland/Norway)", date: "2025-11-10", completed: false },
      { description: "Book winter trip", date: "2025-12-01", completed: false },
      { description: "Buy cold-weather gear", date: "2025-12-10", completed: false },
      { description: "Photograph Aurora Borealis", date: "2026-01-20", completed: false }
    ],
    username: "Sophia Rossi",
    everestImageUrl: "/everest_images/northern_lights.png"
  },
  {
    name: "Write a Short Story Collection",
    details: "I want ten finished pieces, not a folder full of almosts.",
    startDate: "2025-01-15",
    endDate: "2025-12-15",
    milestones: [
      { description: "Outline 10 story ideas", date: "2025-02-01", completed: false },
      { description: "Draft 5 stories", date: "2025-06-01", completed: false },
      { description: "Draft 10 stories", date: "2025-09-01", completed: false },
      { description: "Edit and submit to one mag", date: "2025-11-15", completed: false }
    ],
    username: "Sophia Rossi",
    everestImageUrl: "/everest_images/short_stories.png"
  },
  {
    name: "Italian B1 Fluency",
    details: "Language connects me to family history and better espresso chats.",
    startDate: "2025-03-01",
    endDate: "2025-12-01",
    milestones: [
      { description: "100-day streak on app", date: "2025-06-10", completed: false },
      { description: "5 conversation lessons", date: "2025-08-01", completed: false },
      { description: "Watch a film without subtitles", date: "2025-10-15", completed: false },
      { description: "Pass B1 mock test", date: "2025-11-20", completed: false }
    ],
    username: "Sophia Rossi"
  },

  // --- CHLOE ---
  {
    name: "Run a Full Marathon",
    details: "I want to learn patience the hard way: kilometre by kilometre.",
    startDate: "2025-03-01",
    endDate: "2025-10-20",
    milestones: [
      { description: "Build to 15km long run", date: "2025-04-20", completed: false },
      { description: "20km long run", date: "2025-06-01", completed: false },
      { description: "30km long run", date: "2025-08-15", completed: false },
      { description: "Race day—finish under 5 hours", date: "2025-10-20", completed: false }
    ],
    username: "Chloe Mitchell",
    everestImageUrl: "/everest_images/marathon.png"
  },
  {
    name: "Start a Podcast",
    details: "Because I want to capture the conversations I keep having anyway.",
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    milestones: [
      { description: "Research equipment + format", date: "2025-02-15", completed: false },
      { description: "Record first 3 episodes", date: "2025-04-01", completed: false },
      { description: "Edit and publish", date: "2025-05-10", completed: false },
      { description: "Reach 100 downloads", date: "2025-06-30", completed: false }
    ],
    username: "Chloe Mitchell",
    everestImageUrl: "/everest_images/podcast.png"
  },
  {
    name: "Swim 2km Open Water",
    details: "I want confidence beyond the pool—calm mind, strong stroke.",
    startDate: "2025-05-01",
    endDate: "2025-09-01",
    milestones: [
      { description: "Wetsuit fit + safety intro", date: "2025-05-15", completed: false },
      { description: "First 1km continuous swim", date: "2025-06-20", completed: false },
      { description: "1.5km open water", date: "2025-07-25", completed: false },
      { description: "2km swim event", date: "2025-08-30", completed: false }
    ],
    username: "Chloe Mitchell",
    everestImageUrl: "/everest_images/openwater_swim.png"
  },

  // --- HASSAN ---
  {
    name: "Save £10,000",
    details: "Because I want runway for risk—learning, moving, building.",
    startDate: "2025-01-10",
    endDate: "2025-12-31",
    milestones: [
      { description: "Open high-interest savings account", date: "2025-01-15", completed: false },
      { description: "Automate monthly deposits", date: "2025-02-01", completed: false },
      { description: "Reach £5,000", date: "2025-07-01", completed: false },
      { description: "Hit £10,000", date: "2025-12-15", completed: false }
    ],
    username: "Hassan Ali",
    everestImageUrl: "/everest_images/save_money.png"
  },
  {
    name: "Learn Python for Web",
    details: "I want to ship a small tool people actually use.",
    startDate: "2025-02-01",
    endDate: "2025-08-31",
    milestones: [
      { description: "Finish beginner course", date: "2025-03-10", completed: false },
      { description: "Build Flask CRUD app", date: "2025-05-01", completed: false },
      { description: "Deploy to a free host", date: "2025-06-10", completed: false },
      { description: "Onboard 5 users for feedback", date: "2025-08-15", completed: false }
    ],
    username: "Hassan Ali",
    everestImageUrl: "/everest_images/learn_python.png"
  },
  {
    name: "10 Pull-Ups",
    details: "A clear, honest strength goal with no shortcuts.",
    startDate: "2025-03-01",
    endDate: "2025-09-01",
    milestones: [
      { description: "5 negative reps x 3 sets", date: "2025-03-20", completed: false },
      { description: "First single unassisted", date: "2025-05-01", completed: false },
      { description: "Set of 5", date: "2025-07-01", completed: false },
      { description: "Set of 10", date: "2025-09-01", completed: false }
    ],
    username: "Hassan Ali",
    everestImageUrl: "/everest_images/pull_up.png"
  },

  // --- EMILY ---
  {
    name: "Climb Ben Nevis",
    details: "Because I want a big day out I’ve earned with training.",
    startDate: "2025-05-01",
    endDate: "2025-09-30",
    milestones: [
      { description: "Join hiking club", date: "2025-05-10", completed: false },
      { description: "Two training hills in June", date: "2025-06-25", completed: false },
      { description: "Pick weather window + route plan", date: "2025-08-01", completed: false },
      { description: "Summit safely; debrief notes", date: "2025-08-20", completed: false }
    ],
    username: "Emily Zhang"
  },
  {
    name: "Do a Silent Retreat",
    details: "I want to test how quiet I can get and what I hear there.",
    startDate: "2025-09-01",
    endDate: "2025-12-01",
    milestones: [
      { description: "Research retreat centers", date: "2025-09-15", completed: false },
      { description: "Book weekend slot", date: "2025-10-01", completed: false },
      { description: "Prepare: no phone/laptop rules", date: "2025-11-01", completed: false },
      { description: "Journal reflections after", date: "2025-11-20", completed: false }
    ],
    username: "Emily Zhang",
    everestImageUrl: "/everest_images/silent_retreat.png"
  },
  {
    name: "Sketchbook Habit (100 Pages)",
    details: "Because drawing slows me down in the best way.",
    startDate: "2025-01-20",
    endDate: "2025-10-31",
    milestones: [
      { description: "10 pages", date: "2025-02-15", completed: false },
      { description: "25 pages", date: "2025-03-30", completed: false },
      { description: "60 pages", date: "2025-06-30", completed: false },
      { description: "100 pages", date: "2025-10-31", completed: false }
    ],

    username: "Emily Zhang"
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
      const key = (everest.username || "").toLowerCase().trim();
      const author = createdUsers.find((f) => (f.username || "").toLowerCase().trim() === key);
      return {
        name: everest.name,
        details: everest.details,
        startDate: everest.startDate,
        endDate: everest.endDate,
        milestones: everest.milestones,
        user: author._id,
        everestImageUrl: everest.everestImageUrl
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