import jwt from 'jsonwebtoken';
import env from '../utils/validateEnv';
import User from '../mongo/authUserSchema';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/apiError';


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // Attach user to request (fetch from DB for full info)
    const user = await User.findById((decoded as any).id).select('-password');
    if (!user){
      throw new ApiError(401, 'User not found');
    }
    (req as any).user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(400, 'Invalid or expired reset token'));
  }
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, 'Authentication error'));
  }
};