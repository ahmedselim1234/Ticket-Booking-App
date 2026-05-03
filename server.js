require("dotenv").config();
const morgan = require("morgan");
const connectDB = require("./config/dbconnect");
const logger = require("./util/logger");
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.use(morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } }));

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
});
