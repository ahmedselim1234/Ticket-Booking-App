const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();


router.get("/gettickets", adminController.getTickets);
router.get("/getevents", adminController.getEvents);
router.get("/getticket/:id", adminController.getTicket);
router.get("/getevent/:id", adminController.getEvent);
router.put("/updateEvent/:id", adminController.updateEvent);
router.get("/getclients", adminController.getClients);


router.delete("/deleteevent/:id", adminController.deleteevent);
router.post("/addevent", adminController.addEvent);

module.exports = router;
