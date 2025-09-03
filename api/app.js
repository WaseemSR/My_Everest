const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const everestsRouter = require("./routes/everests");
const authenticationRouter = require("./routes/authentication");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// CORS setup allowing your frontend origin and Authorization header
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle OPTIONS preflight requests
app.options("*", cors({
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parse JSON request bodies
app.use(bodyParser.json());

// Serve static files in /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/users", usersRouter);
app.use("/posts", tokenChecker, postsRouter);
app.use("/everests", tokenChecker, everestsRouter);
app.use("/tokens", authenticationRouter);

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


