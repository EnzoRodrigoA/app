/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@expo|expo|@unimodules)",
  ],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
