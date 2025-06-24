import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Authentication API',
      version: '1.0.0',
      description: 'An Express API for user registration, login, and profile management, documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: "Enter JWT token"
            },
             cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'jwt',
                description: 'JWT cookie for authentication'
            }
        }
    },
    security: [{
        cookieAuth: []
    }]
  },
  // Path to the files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;