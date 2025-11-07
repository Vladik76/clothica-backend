// src/swagger/spec.js
const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Shop API',
    version: '1.0.0',
    description:
      'API documentation for Goods, Categories, and Feedbacks.\n\n' +
      'Пагинация и фильтры соответствуют контроллерам в проекте.',
  },
  servers: [{ url: 'http://localhost:3030', description: 'Local' }],
  tags: [{ name: 'Goods' }, { name: 'Categories' }, { name: 'Feedbacks' }],
  paths: {
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
                examples: {
                  ok: {
                    value: {
                      page: 1,
                      perPage: 10,
                      totalGoods: 123,
                      totalPages: 13,
                      data: [
                        {
                          _id: '671a8a4b7f6b9a001234abcd',
                          name: 'T-shirt',
                          category: '671a89ff7f6b9a001234abca',
                          image: 'https://example.com/img.jpg',
                          price: { value: 599, currency: 'грн' },
                          size: ['S', 'M'],
                          description: 'Soft cotton',
                          feedbacks: [],
                          prevDescription: 'Old text',
                          gender: 'unisex',
                          characteristics: ['100% cotton'],
                          createdAt: '2025-10-30T12:34:56.000Z',
                          updatedAt: '2025-10-30T12:34:56.000Z',
                        },
                      ],
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
                examples: {
                  ok: {
                    value: {
                      page: 1,
                      perPage: 10,
                      total: 7,
                      totalPages: 1,
                      data: [
                        {
                          _id: '671a89ff7f6b9a001234abca',
                          name: 'T-Shirts',
                          image: 'https://example.com/cat.jpg',
                          goodsCount: 42,
                        },
                      ],
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
                examples: {
                  ok: {
                    value: {
                      page: 1,
                      perPage: 3,
                      totalFeedbacks: 5,
                      totalPages: 2,
                      feedbacks: [
                        {
                          _id: '671aaa007f6b9a001234abcd',
                          productId: '671a8a4b7f6b9a001234abcd',
                          category: 'T-Shirts',
                          author: 'Vlad',
                          rate: 5,
                          description: 'Top quality',
                          date: '2025-11-05',
                          createdAt: '2025-11-05T10:00:00.000Z',
                          updatedAt: '2025-11-05T10:00:00.000Z',
                        },
                      ],
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
              examples: {
                create: {
                  value: {
                    productId: '671a8a4b7f6b9a001234abcd',
                    author: 'Vlad',
                    rate: 4,
                    description: 'Норм качество, быстрая доставка',
                    // category — можно не слать (заполнится автоматически по productId)
                    // date — можно не слать (будет YYYY-MM-DD по серверу)
                  },
                },
              },
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
      // ObjectId format hint (для UI)
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

      Good: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          name: { type: 'string' },
          category: { $ref: '#/components/schemas/ObjectId' },
          image: { type: 'string' },
          price: { $ref: '#/components/schemas/Price' },
          size: {
            type: 'array',
            items: { type: 'string' }, // enum ограничен в коде SIZES, но тут без списка
          },
          description: { type: 'string' },
          feedbacks: {
            type: 'array',
            items: { $ref: '#/components/schemas/ObjectId' },
          },
          prevDescription: { type: 'string', nullable: true },
          gender: { type: 'string', enum: ['male', 'female', 'unisex'] },
          characteristics: {
            type: 'array',
            items: { type: 'string' },
          },
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
            examples: {
              bad: {
                value: {
                  status: 400,
                  message: 'Bad Request',
                },
              },
            },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            examples: {
              notFound: {
                value: {
                  status: 404,
                  message: 'Not Found',
                },
              },
            },
          },
        },
      },
      ServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            examples: {
              server: {
                value: {
                  status: 500,
                  message: 'Server Error',
                },
              },
            },
          },
        },
      },
    },
  },
};

export default spec;
