/* eslint-disable */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://localhost:7001`,
    specPattern: 'cypress/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: false,
    fixturesFolder: 'cypress/fixtures'
  },
  env: {
    ...process.env
  }
})
