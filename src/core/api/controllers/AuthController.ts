// src/api/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/core/services/authService';
import { validateRegistration, validateLogin } from '@/api/validation/authValidation';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = validateRegistration(req.body);
      const result = await this.authService.register(validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.verifyEmail(req.params.token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = validateLogin(req.body);
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
