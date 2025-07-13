
const express = require("express");

const clientController = require("../controllers/client");

const router = express.Router();
router.get("/", clientController.getEvents);
router.post("/bookticket", clientController.bookticket);
router.delete("/deletebook/:id", clientController.deleteBook);
router.get("/getclientTickets/:id", clientController.getclientTickets);


module.exports = router; 