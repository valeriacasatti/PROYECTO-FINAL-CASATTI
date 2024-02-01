import { __dirname } from "../utils.js";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce API documentation",
      version: "1.0.0",
      description: "Definition of endpoints for the ecommerce API",
    },
  },
  apis: [`${path.join(__dirname, "/docs/**/*.yaml")}`],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
