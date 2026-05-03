module.exports = {
  env: { node: true, es2021: true, jest: true },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: { ecmaVersion: "latest" },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-process-exit": "off",
  },
};
