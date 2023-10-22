export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["dist", "node_modules"],
  verbose: true,
};
