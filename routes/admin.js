const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();
const { requireAuth } = require("../middleware/isAuth");
const { allowRoles } = require("../middleware/role");

router.get("/gettickets", requireAuth,allowRoles("admin"), adminController.getTickets);
router.get("/getevents", adminController.getEvents);
router.get("/getticket/:id", requireAuth,allowRoles("admin"), adminController.getTicket);
router.get("/getevent/:id", requireAuth,allowRoles("admin"), adminController.getEvent);
router.put("/updateEvent/:id", requireAuth,allowRoles("admin"), adminController.updateEvent);
router.get("/getclients/:id", requireAuth, allowRoles("admin"),adminController.getClients);

router.delete("/deleteevent/:id", requireAuth,allowRoles("admin"), adminController.deleteevent);
router.post("/addevent", requireAuth,allowRoles("admin"), adminController.addEvent);

module.exports = router;
