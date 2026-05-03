const logger = require("../util/logger");

const handleCastError = (err) => ({
  statusCode: 400,
  message: `Invalid ${err.path}: ${err.value}`,
});

const handleValidationError = (err) => ({
  statusCode: 400,
  message: Object.values(err.errors)
    .map((e) => e.message)
    .join(", "),
});

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return { statusCode: 409, message: `${field} already exists` };
};

const handleJWTError = () => ({
  statusCode: 401,
  message: "Invalid token, please log in again",
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: "Token expired, please log in again",
});

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") ({ statusCode, message } = handleCastError(err));
  if (err.name === "ValidationError") ({ statusCode, message } = handleValidationError(err));
  if (err.code === 11000) ({ statusCode, message } = handleDuplicateKeyError(err));
  if (err.name === "JsonWebTokenError") ({ statusCode, message } = handleJWTError());
  if (err.name === "TokenExpiredError") ({ statusCode, message } = handleJWTExpiredError());

  logger.error(message, {
    statusCode,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  const payload = { status: statusCode < 500 ? "fail" : "error", message };
  if (process.env.NODE_ENV === "development") payload.stack = err.stack;

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
