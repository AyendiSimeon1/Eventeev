import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../core/services/auth/authService';
import { validateRegistration } from '../validation/authValidator';

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

  googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const result = await this.authService.googleSignIn(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  setupOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = validateOrganization(req.body);
      const result = await this.authService.setupOrganization(req.user.id, validatedData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.forgotPassword(req.body.email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      const result = await this.authService.resetPassword(token, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}