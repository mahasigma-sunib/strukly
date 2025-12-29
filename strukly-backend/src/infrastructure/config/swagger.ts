import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Strukly API",
      version: "1.0.0",
      description: "API documentation for Strukly application",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
      },
      schemas: {
        Money: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              description: "The monetary amount",
            },
            currency: {
              type: "string",
              description: "The currency code (e.g., USD, EUR)",
            },
          },
        },
        ExpenseItemResponse: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            quantity: { type: "integer" },
            singlePrice: { $ref: "#/components/schemas/Money" },
            totalPrice: { $ref: "#/components/schemas/Money" },
            expenseID: { type: "string", format: "uuid" },
          },
        },
        ExpenseResponse: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            vendorName: { type: "string" },
            category: { type: "string" },
            dateTime: { type: "string", format: "date-time" },
            subtotalAmount: { $ref: "#/components/schemas/Money" },
            taxAmount: { $ref: "#/components/schemas/Money" },
            discountAmount: { $ref: "#/components/schemas/Money" },
            serviceAmount: { $ref: "#/components/schemas/Money" },
            totalAmount: { $ref: "#/components/schemas/Money" },
            userID: { type: "string", format: "uuid" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/ExpenseItemResponse" },
            },
          },
        },
        GoalItemResponse: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            price: { type: "integer" },
            deposited: { type: "integer" },
            completed: { type: "boolean" },
            completedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BudgetHistoryResponse: {
          type: "object",
          properties: {
            month: { type: "integer" },
            year: { type: "integer" },
            budget: { type: "integer" },
            unusedBudget: { type: "integer" },
          },
        },
        HistoryItemResponse: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
            id: { type: "string", format: "uuid" },
            subtotal: { type: "number" },
            tax: { type: "number" },
            service: { type: "number" },
            discount: { type: "number" },
            total_expense: { type: "number" },
            total_my_expense: { type: "number" },
            category: { type: "string" },
            datetime: { type: "string", format: "date-time" },
            members: { type: "array", items: { type: "string" } },
            vendor: { type: "string" },
          },
        },
        WeeklyData: {
          type: "object",
          properties: {
            week: { type: "integer" },
            spending: { type: "number" },
            startDate: { type: "number" },
            endDate: { type: "number" },
          },
        },
        ExpenseReportResponse: {
          type: "object",
          properties: {
            total: { type: "number" },
            weekly: {
              type: "array",
              items: { $ref: "#/components/schemas/WeeklyData" },
            },
            history: {
              type: "array",
              items: { $ref: "#/components/schemas/HistoryItemResponse" },
            },
          },
        },
        CreateExpenseRequest: {
          type: "object",
          required: [
            "vendorName",
            "category",
            "dateTime",
            "subtotalAmount",
            "taxAmount",
            "discountAmount",
            "serviceAmount",
            "items",
          ],
          properties: {
            vendorName: { type: "string" },
            category: { type: "string" },
            dateTime: { type: "string", format: "date-time" },
            subtotalAmount: { $ref: "#/components/schemas/Money" },
            taxAmount: { $ref: "#/components/schemas/Money" },
            discountAmount: { $ref: "#/components/schemas/Money" },
            serviceAmount: { $ref: "#/components/schemas/Money" },
            items: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "quantity", "singlePrice"],
                properties: {
                  name: { type: "string" },
                  quantity: { type: "integer" },
                  singlePrice: { $ref: "#/components/schemas/Money" },
                },
              },
            },
          },
        },

        UpdateExpenseRequest: {
          type: "object",
          required: [
            "vendorName",
            "category",
            "dateTime",
            "subtotalAmount",
            "taxAmount",
            "discountAmount",
            "serviceAmount",
            "items",
          ],
          properties: {
            vendorName: { type: "string" },
            category: { type: "string" },
            dateTime: { type: "string", format: "date-time" },
            subtotalAmount: { $ref: "#/components/schemas/Money" },
            taxAmount: { $ref: "#/components/schemas/Money" },
            discountAmount: { $ref: "#/components/schemas/Money" },
            serviceAmount: { $ref: "#/components/schemas/Money" },
            items: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "quantity", "singlePrice"],
                properties: {
                  name: { type: "string" },
                  quantity: { type: "integer" },
                  singlePrice: { $ref: "#/components/schemas/Money" },
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
  apis: ["./src/infrastructure/routes/*.ts"], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
