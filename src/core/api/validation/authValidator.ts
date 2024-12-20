import { z } from 'zod';
import { AppError } from '../../utils/errors';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});


export const validateRegistration = (data: unknown) => {
  try {
    return registrationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')} - ${err.message}`).join(', ');
      throw new AppError(errorMessage);
    }
    throw error;
  }
};