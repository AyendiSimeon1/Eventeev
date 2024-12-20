import { Router } from 'express';
import { createAuthRouter } from './authRoutes';
import { AuthService } from '../../services/auth/authService';
import { AuthController } from '../controllers/AuthController';

const authService = new AuthService();
const authController = new AuthController(authService);
const authRouter = createAuthRouter(authController);

const router = Router();

router.use('/auth', authRouter);

export default router;