const mongoose = require("mongoose");

process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "test_access_secret_for_jest";
process.env.REFRESH_TOKEN_SECRET = "test_refresh_secret_for_jest";
process.env.EMAIL_HOST = "smtp.test.com";
process.env.EMAIL_PORT = "465";
process.env.EMAIL_USER = "test@test.com";
process.env.EMAIL_PASS = "testpass";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
