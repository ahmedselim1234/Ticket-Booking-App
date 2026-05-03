const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "fail", message: errors.array()[0].msg });
  }
  next();
};

exports.bookTicketValidator = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("eventId").isMongoId().withMessage("Invalid event ID"),
  handleValidation,
];
