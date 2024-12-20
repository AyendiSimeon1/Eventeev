import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../../infrastructure/database/schemas/userSchema';
import { Organization } from '../../infrastructure/database/organizationSchema';
// import { sendEmail } from '../../services/auth/authService';
import { AppError } from '../../utils/errors';
import { config } from '../../../config/enviroment';

const googleClient = new OAuth2Client(config.google.clientId);

export class AuthService {
  private generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
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
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already registered');
    }
    const verificationToken = this.generateToken();
    const user = await User.create({
      ...userData,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      hasCompletedSetup: false
    });

    // await this.sendVerificationEmail(user.email, verificationToken);

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hasCompletedSetup: user.hasCompletedSetup
      },
      message: 'Registration successful. Please verify your email.'
    };
  }

  
  async googleSignIn(token: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: config.google.clientId
    });
    
    const payload = ticket.getPayload();
    if (!payload) throw new AppError(400, 'Invalid Google token');

    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      user = await User.create({
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        email: payload.email,
        googleId: payload.sub,
        isEmailVerified: true,
        hasCompletedSetup: false
      });
    }

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hasCompletedSetup: user.hasCompletedSetup
      },
      token: this.generateJWT(user._id)
    };
  }

  async setupOrganization(userId: string, orgData: {
    name: string;
    type: 'company' | 'individual' | 'nonprofit';
    address?: string;
    phone?: string;
    website?: string;
  }) {
    const user = await User.findById(userId);
    if (!user) throw new AppError(404, 'User not found');

    if (user.organization) {
      throw new AppError(400, 'User already has an organization');
    }

    const organization = await Organization.create({
      ...orgData,
      owner: userId,
      members: [userId]
    });

    user.organization = organization._id;
    user.hasCompletedSetup = true;
    await user.save();

    return {
      organization,
      message: 'Organization setup completed successfully'
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, 'No user found with this email address');
    }

    const resetToken = this.generateToken();
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await this.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Password reset instructions sent to email'
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return {
      message: 'Password reset successful'
    };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${config.app.url}/verify-email/${token}`;
    await sendEmail({
      to: email,
      subject: 'Email Verification',
      template: 'emailVerification',
      context: { verificationUrl }
    });
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${config.app.url}/reset-password/${token}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      template: 'passwordReset',
      context: { resetUrl }
    });
  }
}