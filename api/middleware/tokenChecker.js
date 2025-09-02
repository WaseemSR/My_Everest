const JWT = require("jsonwebtoken");

function tokenChecker(req, res, next) {
  const authHeader = req.get("Authorization");
  console.log("Authorization header received:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Token payload:", payload);
    const user_id = payload.sub;

    if (!user_id) {
      throw new Error("No sub claim in JWT token");
    }

    req.user_id = user_id;
    next();
  } catch (err) {
    console.error("TokenChecker error:", err.message);
    res.status(401).json({ message: err.message });
  }
}

module.exports = tokenChecker;
