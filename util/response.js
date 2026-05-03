exports.successResponse = (res, statusCode, message, data = null) => {
  const payload = { status: "success", message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

exports.failResponse = (res, statusCode, message) =>
  res.status(statusCode).json({ status: "fail", message });
