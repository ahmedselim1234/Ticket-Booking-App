const express = require("express");
const clientController = require("../controllers/client");
const { requireAuth } = require("../middleware/isAuth");
const { allowRoles } = require("../middleware/role");
const { bookTicketValidator } = require("../middleware/validators/ticketValidators");

const router = express.Router();
const clientOnly = [requireAuth, allowRoles("client")];

/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Client endpoints
 */

router.get("/", clientController.getEvents);
router.post("/bookticket", ...clientOnly, bookTicketValidator, clientController.bookticket);
router.delete("/deletebook/:id", ...clientOnly, clientController.deleteBook);
router.get("/getclientTickets/:id", ...clientOnly, clientController.getclientTickets);

module.exports = router;
