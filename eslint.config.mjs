import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Ignore unused variables starting with an underscore
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],

      // Allow any if absolutely necessary
      "@typescript-eslint/no-explicit-any": [
        "warn",
        { ignoreRestArgs: true },
      ],

      // Ignore React prop types as we're using TypeScript
      "react/prop-types": "off",

      // Disable the <img> warning (use with caution)
      "@next/next/no-img-element": "off",

      // Fix useEffect dependency warnings
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
