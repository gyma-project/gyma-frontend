import { defineConfig } from "cypress";
import fs from "fs";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      config.env.KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
      config.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
      return config;
    },
  },
});
