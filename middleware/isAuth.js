const jwt = require("jsonwebtoken");
const AppError = require("../util/AppError");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return next(new AppError("Not authenticated", 401));

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return next(new AppError("Invalid or expired token", 403));
    req.user = decoded.userInfo;
    next();
  });
};

module.exports = { requireAuth };
