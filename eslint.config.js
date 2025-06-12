import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "src/components/ui"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "prefer-const": "error",
      "no-console": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-debugger": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-boolean-value": ["warn", "never"],
      "react/self-closing-comp": "warn",
      "react/jsx-pascal-case": "warn",
    },
  }
);
