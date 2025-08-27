const JWT = require("jsonwebtoken");

// Middleware function to check for valid tokens
function tokenChecker(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");
  console.log("Authorization header received:", authHeader);

  if (authHeader) {
    token = authHeader.slice(7);
  }

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Token payload:", payload);
    const user_id = payload.sub;

    if (!user_id) {
      throw new Error("No sub claim in JWT token");
    }

    // Add the user_id from the payload to the Express req object.
    req.user_id = user_id;
    next();
  } catch (err) {
    console.error("TokenChecker error:", err.message); // 👈 clearer error
    res.status(401).json({ message: err.message });
  }
}

module.exports = tokenChecker;
