
const express = require("express");

const clientController = require("../controllers/client");
const {requireAuth} = require("../middleware/isAuth");
const { allowRoles } = require("../middleware/role");

const router = express.Router();
router.get("/", clientController.getEvents);
router.post("/bookticket/",requireAuth,allowRoles("client"), clientController.bookticket);
router.delete("/deletebook/:id", requireAuth,allowRoles("client"),clientController.deleteBook);
router.get("/getclientTickets/:id", requireAuth,allowRoles("client"),clientController.getclientTickets);

 
module.exports = router; 