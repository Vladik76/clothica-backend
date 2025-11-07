// src/swagger/spec.js
const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Shop API',
    version: '1.1.0',
    description:
      'API documentation for Auth, Goods, Categories, and Feedbacks.\n' +
      'Пагинация/фильтры соответствуют текущим контроллерам. Auth — cookie-based с sessionId/accessToken/refreshToken.',
  },
  servers: [
    { url: 'https://clothica-backend.onrender.com/', description: 'Render' },
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Goods' },
    { name: 'Categories' },
    { name: 'Feedbacks' },
  ],
  paths: {
    // ===== AUTH =====
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRegister' },
              examples: {
                register: {
                  value: {
                    email: 'user@example.com',
                    password: 'P@ssw0rd!',
                    name: 'Vlad',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description:
              'User created. Cookies sessionId/accessToken/refreshToken будут установлены Set-Cookie.',
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description:
                  'sessionId, accessToken, refreshToken (httpOnly). Устанавливаются в ответе.',
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserPublic' },
              },
            },
          },
          400: {
            description: 'Email in use / validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email/password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthLogin' },
              examples: {
                login: {
                  value: { email: 'user@example.com', password: 'P@ssw0rd!' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description:
              'OK. Cookies sessionId/accessToken/refreshToken будут перезаписаны.',
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description:
                  'sessionId, accessToken, refreshToken (httpOnly). Устанавливаются в ответе.',
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserPublic' },
              },
            },
          },
          401: {
            description: 'User not found / Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and clear cookies',
        responses: {
          204: { description: 'No Content (cookies cleared)' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh session using cookies (sessionId + refreshToken)',
        responses: {
          200: {
            description: 'Session refreshed (cookies re-set)',
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description:
                  'sessionId, accessToken, refreshToken (httpOnly). Устанавливаются в ответе.',
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthMessage' },
                examples: { ok: { value: { message: 'Session refreshed' } } },
              },
            },
          },
          401: {
            description: 'Session not found / token expired',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/auth/request-reset-email': {
      post: {
        tags: ['Auth'],
        summary: 'Send password reset link to email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetEmailRequest' },
              examples: {
                send: { value: { email: 'user@example.com' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Email sent',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthMessage' },
                examples: {
                  ok: {
                    value: {
                      message: 'Password reset email sent successfully',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token from email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
              examples: {
                reset: {
                  value: {
                    token: 'jwt-token-from-email',
                    password: 'NewStrongP@ss1',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthMessage' },
                examples: {
                  ok: {
                    value: {
                      message:
                        'Password reset successfully. Please log in again.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid or expired token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== GOODS =====
    '/goods': {
      get: {
        tags: ['Goods'],
        summary: 'Get goods list with filters & pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number (>=1)',
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
            description: 'Items per page (1..50)',
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', format: 'objectId' },
            description: 'Category ObjectId',
          },
          {
            name: 'size',
            in: 'query',
            schema: {
              oneOf: [
                { type: 'string' }, // size=S
                { type: 'array', items: { type: 'string' } }, // size=S&size=M
              ],
            },
            description: 'Size or repeated sizes',
          },
          {
            name: 'gender',
            in: 'query',
            schema: { type: 'string', enum: ['male', 'female', 'unisex'] },
            description: 'Gender filter',
          },
          {
            name: 'minPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 },
            description: 'Minimum price (by price.value)',
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 },
            description: 'Maximum price (by price.value)',
          },
        ],
        responses: {
          200: {
            description: 'Paged goods list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    totalGoods: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Good' },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/goods/{goodId}': {
      get: {
        tags: ['Goods'],
        summary: 'Get good by id',
        parameters: [
          {
            name: 'goodId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'objectId' },
          },
        ],
        responses: {
          200: {
            description: 'Good',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Good' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== CATEGORIES =====
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get categories (aggregated from goods)',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 10 },
          },
        ],
        responses: {
          200: {
            description: 'Paged categories summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    total: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CategorySummary' },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== FEEDBACKS =====
    '/feedbacks': {
      get: {
        tags: ['Feedbacks'],
        summary: 'Get feedbacks for product',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 3 },
          },
          {
            name: 'productId',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'objectId' },
            description: 'Good ObjectId to filter feedbacks',
          },
        ],
        responses: {
          200: {
            description: 'Paged feedbacks for product',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    totalFeedbacks: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    feedbacks: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Feedback' },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      post: {
        tags: ['Feedbacks'],
        summary: 'Create feedback',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FeedbackCreate' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created feedback',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Feedback' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
  },

  components: {
    // ====== SCHEMAS ======
    schemas: {
      ObjectId: {
        type: 'string',
        description: 'Mongo ObjectId',
        example: '671a8a4b7f6b9a001234abcd',
      },
      Currency: {
        type: 'string',
        description: 'Currency code from CURRENCIES',
        example: 'грн',
      },
      Price: {
        type: 'object',
        properties: {
          value: { type: 'number', minimum: 0 },
          currency: { $ref: '#/components/schemas/Currency' },
        },
        required: ['value', 'currency'],
      },

      // ---- Auth
      UserPublic: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
          updatedAt: { type: 'string', format: 'date-time', nullable: true },
        },
        required: ['_id', 'email', 'name'],
      },
      AuthRegister: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          name: { type: 'string' },
        },
        required: ['email', 'password', 'name'],
      },
      AuthLogin: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
      ResetEmailRequest: {
        type: 'object',
        properties: { email: { type: 'string', format: 'email' } },
        required: ['email'],
      },
      ResetPasswordRequest: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 8 },
        },
        required: ['token', 'password'],
      },
      AuthMessage: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },

      // ---- Domain
      Good: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          name: { type: 'string' },
          category: { $ref: '#/components/schemas/ObjectId' },
          image: { type: 'string' },
          price: { $ref: '#/components/schemas/Price' },
          size: { type: 'array', items: { type: 'string' } },
          description: { type: 'string' },
          feedbacks: {
            type: 'array',
            items: { $ref: '#/components/schemas/ObjectId' },
          },
          prevDescription: { type: 'string', nullable: true },
          gender: { type: 'string', enum: ['male', 'female', 'unisex'] },
          characteristics: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
          'name',
          'category',
          'image',
          'price',
          'description',
          'gender',
        ],
      },
      Category: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['name'],
      },
      CategorySummary: {
        type: 'object',
        description:
          'Возвращается /categories из агрегирования по товарам + lookup реальной категории',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' }, // id категории
          name: { type: 'string' },
          image: { type: 'string' },
          goodsCount: { type: 'integer' },
        },
      },
      Feedback: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          productId: { $ref: '#/components/schemas/ObjectId' },
          category: { type: 'string', nullable: true },
          author: { type: 'string' },
          rate: { type: 'integer', minimum: 1, maximum: 5 },
          description: { type: 'string' },
          date: {
            type: 'string',
            description: 'YYYY-MM-DD',
            example: '2025-10-15',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['productId', 'author', 'rate', 'description'],
      },
      FeedbackCreate: {
        type: 'object',
        properties: {
          productId: { $ref: '#/components/schemas/ObjectId' },
          category: {
            type: 'string',
            description:
              'Опционально — если не передать, подставится name категории по productId',
          },
          author: { type: 'string' },
          rate: { type: 'integer', minimum: 1, maximum: 5 },
          description: { type: 'string' },
          date: {
            type: 'string',
            description:
              'Опционально — если не передать, подставится текущая дата в формате YYYY-MM-DD',
            example: '2025-10-15',
          },
        },
        required: ['productId', 'author', 'rate', 'description'],
      },

      Error: {
        type: 'object',
        properties: {
          status: { type: 'integer' },
          message: { type: 'string' },
          details: { type: 'object', nullable: true },
        },
      },
    },

    // ====== COMMON RESPONSES ======
    responses: {
      BadRequest: {
        description: 'Validation error / bad request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      ServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
    },
  },
};

export default spec;
