const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "fail", message: errors.array()[0].msg });
  }
  next();
};

exports.createEventValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("place").trim().notEmpty().withMessage("Place is required"),
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO date")
    .custom((val) => {
      if (new Date(val) <= new Date()) throw new Error("Event date must be in the future");
      return true;
    }),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("maxTickets").isInt({ gt: 0 }).withMessage("Max tickets must be greater than 0"),
  handleValidation,
];

exports.updateEventValidator = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("place").optional().trim().notEmpty().withMessage("Place cannot be empty"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("maxTickets").optional().isInt({ gt: 0 }).withMessage("Max tickets must be greater than 0"),
  handleValidation,
];
