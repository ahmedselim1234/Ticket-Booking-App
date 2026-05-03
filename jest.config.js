module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "middleware/**/*.js",
    "util/**/*.js",
    "!util/logger.js",
  ],
  coverageThreshold: {
    global: { lines: 60, functions: 55, branches: 50 },
  },
  globalSetup: "./tests/globalSetup.js",
  globalTeardown: "./tests/globalTeardown.js",
  setupFilesAfterEnv: ["./tests/setup.js"],
  testTimeout: 30000,
};
