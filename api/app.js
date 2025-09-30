const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const usersRouter = require("./routes/users");
const everestsRouter = require("./routes/everests");
const authenticationRouter = require("./routes/authentication");
const commentsRouter = require("./routes/comments");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// CORS setup allowing configured frontend origins and Authorization header
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests or if no origins configured
    if (!origin || allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options("*", cors(corsOptions));

// Parse JSON request bodies
app.use(bodyParser.json());

// Serve static files in /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/users", usersRouter); 

app.use("/everests", tokenChecker, everestsRouter);

app.use("/tokens", authenticationRouter);
app.use("/comments", tokenChecker, commentsRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;

