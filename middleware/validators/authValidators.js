const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "fail", message: errors.array()[0].msg });
  }
  next();
};

exports.signupValidator = [
  body("first_name").trim().notEmpty().withMessage("First name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and a number"),
  handleValidation,
];

exports.loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

exports.forgetPasswordValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  handleValidation,
];

exports.resetCodeValidator = [
  body("enteredCode")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("Reset code must be a 6-digit number"),
  handleValidation,
];

exports.newPasswordValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and a number"),
  handleValidation,
];
