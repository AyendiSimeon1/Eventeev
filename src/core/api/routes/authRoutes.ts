import { Router } from 'express';
import { AuthController } from '../controllers/authController';

export const createAuthRouter = (authController: AuthController) => {
  const router = Router();

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/verify-email/:token', authController.verifyEmail);

  return router;
};