import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from "svelte-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import { globalIgnores } from 'eslint/config';
import globals from 'globals';

export default ts.config([
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  globalIgnores([
    "**/node_modules/",
    "**/dist/",
    "**/.dist/",
    "**/coverage/",
    "apps/mobile/",
    "apps/extension/public",
    "**/storybook-static"
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    }
  },
  // Extension Configuration
  {
    files: [
      "apps/extension/**/*.{ts,svelte,svelte.js,svelte.ts}",
    ],
    languageOptions: {
      globals: {
        Spotify: "readonly"
      }
    }
  },
  // Svelte Configuration
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
      parserOptions: {
        parser: tsParser
      }
    },
  },
]);
