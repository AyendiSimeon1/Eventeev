import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '@/infrastructure/database/schemas/userSchema';
import { sendEmail } from '@/infrastructure/email/emailService';
import { AppError } from '@/utils/errors';
import { config } from '@/config/environment';

export class AuthService {
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateJWT(userId: string): string {
    return jwt.sign({ id: userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // Create verification token
    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      ...userData,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    // Send verification email
    const verificationUrl = `${config.app.url}/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      template: 'emailVerification',
      context: {
        name: user.firstName,
        verificationUrl
      }
    });

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      message: 'Registration successful. Please verify your email.'
    };
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return {
      message: 'Email verified successfully'
    };
  }

  async login(email: string, password: string) {
    // Find user and select password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new AppError(401, 'Please verify your email before logging in');
    }

    // Generate JWT
    const token = this.generateJWT(user._id);

    return {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    };
  }
}

