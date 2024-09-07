/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  arrowParens: 'always',
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  trailingComma: 'none'
};

export default config;
