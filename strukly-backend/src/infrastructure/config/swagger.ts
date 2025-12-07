import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Strukly API',
      version: '1.0.0',
      description: 'API documentation for Strukly application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
      schemas: {
        Money: {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              description: 'The monetary amount',
            },
            currency: {
              type: 'string',
              description: 'The currency code (e.g., USD, EUR)',
            },
          },
        },
        ExpenseResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            vendorName: { type: 'string' },
            category: { type: 'string' },
            dateTime: { type: 'string', format: 'date-time' },
            subtotalAmount: { $ref: '#/components/schemas/Money' },
            taxAmount: { $ref: '#/components/schemas/Money' },
            discountAmount: { $ref: '#/components/schemas/Money' },
            serviceAmount: { $ref: '#/components/schemas/Money' },
            totalAmount: { $ref: '#/components/schemas/Money' },
            userID: { type: 'string', format: 'uuid' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  quantity: { type: 'integer' },
                  singlePrice: { $ref: '#/components/schemas/Money' },
                  totalPrice: { $ref: '#/components/schemas/Money' },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/infrastructure/routes/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
