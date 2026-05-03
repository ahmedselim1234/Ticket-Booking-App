const express = require("express");
const adminController = require("../controllers/admin");
const { requireAuth } = require("../middleware/isAuth");
const { allowRoles } = require("../middleware/role");
const { createEventValidator, updateEventValidator } = require("../middleware/validators/eventValidators");

const router = express.Router();
const adminOnly = [requireAuth, allowRoles("admin")];

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

router.get("/gettickets", ...adminOnly, adminController.getTickets);
router.get("/getticket/:id", ...adminOnly, adminController.getTicket);
router.get("/getevents", ...adminOnly, adminController.getEvents);
router.get("/getevent/:id", ...adminOnly, adminController.getEvent);
router.get("/getclients/:id", ...adminOnly, adminController.getClients);
router.post("/addevent", ...adminOnly, createEventValidator, adminController.addEvent);
router.put("/updateEvent/:id", ...adminOnly, updateEventValidator, adminController.updateEvent);
router.delete("/deleteevent/:id", ...adminOnly, adminController.deleteEvent);

module.exports = router;
