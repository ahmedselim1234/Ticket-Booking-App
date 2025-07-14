const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/refresh',authController.refresh);
router.post('/logout',authController.logout);
router.post('/forgetpassword',authController.forgetPassword);
router.post('/verifyResetCode',authController.verifyResetCode);
router.put('/addnewpassword',authController.addNewPassword);


module.exports = router;   
