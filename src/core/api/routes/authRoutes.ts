import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';


export const createAuthRouter = (authController: AuthController) => {
  const router = Router();

  router.post('/register', authController.register);
  router.post('/google/signin', authController.googleSignIn);
  router.post('/organization/setup', authController.setupOrganization);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);

  return router;
};