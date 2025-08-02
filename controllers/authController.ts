import env from "../utils/validateEnv";
import { NextFunction, Request, Response} from 'express';
import User from '../mongo/authUserSchema';
import jwt, { Secret } from 'jsonwebtoken';
import { ApiError } from "../errors/apiError";
import { sendEmail } from '../utils/mailer';
import prisma from '../prisma'; // Import Prisma client

const JWT_SECRET: Secret = env.JWT_SECRET;
const JWT_EXPIRATION = env.JWT_EXPIRATION; // troubleshoot

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // accepts request body with email and password
  const { email, password } = req.body;
  try {
    // finds user by email
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, 'Invalid credentials');

    // checks for a match between provided password and that user's password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(400, 'Invalid credentials');
    
    // if match, creates a JWT token with user ID and secret, sets expiration to 1 day
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    // send user info (excluding password) along with token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, "Login error"));
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // accepts request body with email and password
  const { firstName, lastName, phone, dob, email, password, role} = req.body;
  try {
    // Check if user already exists by unique email field
    const user = await User.findOne({ email });
    if (!user){
        // if user does not exist, creates a new user with the provided email and password
        const newUser = new User({ firstName, lastName, phone, dob, email, password, role});
        await newUser.save();
        // create a new row in postgres user_profiles table with mongo_id set to mongo user ID
        await prisma.user_profiles.create({
           data: {
             mongo_id: newUser._id.toString(), 
            }
        });
        await prisma.user_loadouts.create({
           data: {
             mongo_id: newUser._id.toString(), 
            }
        });
        await prisma.user_recommendations.create({
           data: {
             mongo_id: newUser._id.toString(), 
            }
        });
        res.status(201).json({ message: 'User registered successfully' });
        return;
    } else{
        throw new ApiError(400, 'An account with this email already exists');
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, "Registration error"));
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, newPassword } = req.body;
  try {   
    // Find user by email
    const user = await User.findOne({email});
    if (!user){
      throw new ApiError(400, 'User not found');
    } else {
      // Check if old password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new ApiError(400, 'Old password is incorrect');
      }
      // Check if new password is the same as old password
      if (newPassword === password) {
        throw new ApiError(400, 'New password cannot be the same as old password');
      }
      // Update user's password
      user.password = newPassword;
      await user.save();
      // Generate new JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(200).json({ message: 'Password reset successfully', token, user: userWithoutPassword });
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, "Password reset error"));
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {email} = req.body;
  try {
    // Check if user already exists by unique email field
    const user = await User.findOne({ email });
    if (!user){
      throw new ApiError(400, 'User not found');
    } else{
      // Generate a reset token (could be a random string or JWT)
      const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      // Build reset link using CLIENT_URL
      const resetLink = `${env.CLIENT_URL}/reset-pass-with-token?token=${resetToken}`;
      // Send the reset link to the user's email
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
        html: `<p>You requested a password reset.</p><p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
      });
      res.status(200).json({ message: 'Reset link sent to email' });
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, "Forgot password error"));
  }
};

export const resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { resetToken, newPassword } = req.body;
  try {
    // Verify the reset token
    const decoded: any = jwt.verify(resetToken, JWT_SECRET);
    const userId = decoded.id;
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }
    // Optionally, check if new password is same as old password
    const isSame = await user.comparePassword(newPassword);
    if (isSame) {
      throw new ApiError(400, 'New password cannot be the same as old password');
    }
    // Update password
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(400, 'Invalid or expired reset token'));
    }
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, 'Password reset error'));
  }
};