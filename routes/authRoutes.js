const express = require("express");
const authController = require("../controllers/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  signupValidator,
  loginValidator,
  forgetPasswordValidator,
  resetCodeValidator,
  newPasswordValidator,
} = require("../middleware/validators/authValidators");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, email, password]
 *             properties:
 *               first_name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Account created }
 *       409: { description: Email already in use }
 */
router.post("/signup", authLimiter, signupValidator, authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Logged in }
 *       401: { description: Invalid credentials }
 */
router.post("/login", authLimiter, loginValidator, authController.login);

router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgetpassword", authLimiter, forgetPasswordValidator, authController.forgetPassword);
router.post("/verifyResetCode", resetCodeValidator, authController.verifyResetCode);
router.put("/addnewpassword", newPasswordValidator, authController.addNewPassword);

module.exports = router;
