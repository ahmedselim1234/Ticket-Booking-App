// exports.allowRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access Denied" });
//     }
//     next();
//   };
// };

exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};

// module.exports = { allowRoles };
