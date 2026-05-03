const { MongoMemoryReplSet } = require("mongodb-memory-server");

module.exports = async () => {
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await replSet.waitUntilRunning();
  process.env.MONGO_URI = replSet.getUri();
  global.__MONGOSERVER__ = replSet;
};
