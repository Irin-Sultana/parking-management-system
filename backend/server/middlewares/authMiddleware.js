const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes by verifying JWT tokens.
 * This middleware checks for the presence of a token in the Authorization header,
 */
const protect = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
