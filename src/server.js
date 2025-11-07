// src/server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import categoryRoutes from './routes/categoryRoutes.js';
import goodRoutes from './routes/goodRoutes.js';
import swaggerUi from 'swagger-ui-express';
import spec from './swagger/spec.js';
import feedbackRoutes from './routes/feedbackRoutes.js';


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

app.use(categoryRoutes);
app.use(goodRoutes);
app.use(feedbackRoutes);

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
