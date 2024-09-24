import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación ecommerce Antojitos",
      description: "API para documentar ecommerce del proyecto de backend",
    },
  },
  apis: ['src/docs/**/*.yaml'],
};

const specs = swaggerJsdoc(swaggerOptions);

export { specs, swaggerUiExpress };
