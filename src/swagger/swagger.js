import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clothica API',
      version: '1.0.0',
      description:
        'API documentation for the Clothica backend (Node.js + Express + MongoDB)',
    },
    servers: [{ url: 'http://localhost:3030', description: 'Local server' }],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerSpec);
