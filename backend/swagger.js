import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'User Authentication API',
      version: '1.0.0',
      description: 'An Express API for user registration and login, documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Your local development server
        description: 'Development server',
      },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }]
  },
  // Path to the API docs
  apis: ['/routes/*.js',], // Path to your API route files
};

const specs = swaggerJsdoc(options);

export default specs;