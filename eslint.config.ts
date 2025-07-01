import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelteParser from "svelte-eslint-parser";

export default ts.config([
  js.configs.recommended,
  ts.configs.recommended,
  {
    files: [
      "**/*.svelte",
      "*.svelte",
      // Need to specify the file extension for Svelte 5 with rune symbols
      "**/*.svelte.js",
      "*.svelte.js",
      "**/*.svelte.ts",
      "*.svelte.ts",
    ],
    languageOptions: {
      parser: svelteParser,
    },
  },
]);
