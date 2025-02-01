/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none",
  printWidth: 80,
  svelteSortOrder: "scripts-styles-markup"
};

export default config;
