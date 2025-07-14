const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authheader = req.headers.authorization || req.headers.Authorization;
  if (!authheader?.startsWith("Bearer "))
    return res.status(401).json({ message: "unAuth" });

  const token = authheader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // token exist but not true
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "forbiddennnnnnnn" });
    }
    req.user = decoded.userInfo;
    next();
  });
};
 
module.exports = { requireAuth };

