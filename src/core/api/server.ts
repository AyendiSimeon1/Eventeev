import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../../config/enviroment'; 
import { errorHandler } from './middleware/error';
import { logger } from '../utils/logger';
import router  from '../api/routes/index';
import { connectDB } from '../../config/database';

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

start();