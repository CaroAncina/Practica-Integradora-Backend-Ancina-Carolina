import swaggerJsdoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación ecommerce Antojitos ",
      description: "API para documentar ecommerce del proyecto de backend",
    },
  },
  apis: [`/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));

export default swaggerOptions;
