import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import eslintParserTs from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts"], // Lint only TypeScript files
    languageOptions: {
      ecmaVersion: "latest", // Support modern JavaScript
      sourceType: "module", // Enable ES Modules
      parser: eslintParserTs, // Use TypeScript parser
    },
    plugins: {
      "@typescript-eslint": eslintPluginTs,
    },
    rules: {
      // Core rules
      "no-unused-vars": "off", // Disable ESLint's unused vars to defer to TypeScript
      "@typescript-eslint/no-unused-vars": "off", // Disabled to avoid duplicate checks
      // Add code quality rules here
      semi: ["warn", "always"], // Example: Warn if semicolons are missing
      quotes: ["warn", "double", { avoidEscape: true }],
    },
  },
];
