module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: { "^.+\\.(js|jsx)$": "babel-jest" },
  moduleNameMapper: { "\\.(css|scss|sass)$": "identity-obj-proxy" },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};