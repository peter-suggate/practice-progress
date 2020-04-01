module.exports = {
  rootDir: "..",
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true
    },
    globalThis: {}
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  testURL: "http://localhost",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  modulePathIgnorePatterns: ["/dist/"],
  setupFiles: ["<rootDir>/src/audio/test-fixtures/setup.ts"]
};
