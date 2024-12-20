import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../../config/enviroment'; 
import { errorHandler } from './middleware/error';
import { logger } from '../utils/logger';

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


app.use(errorHandler);

const start = async () => {
  try {
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

start();