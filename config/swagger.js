const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tazkarty — Ticket Booking API",
      version: "1.0.0",
      description: "REST API for booking event tickets with role-based access control.",
      contact: { name: "Ahmed", email: "ahness97@gmail.com" },
    },
    servers: [
      { url: "http://localhost:5000", description: "Development" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
