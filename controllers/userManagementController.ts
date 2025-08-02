import { NextFunction, Request, Response } from 'express';
import User from '../mongo/authUserSchema';
import { ApiError } from '../errors/apiError';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, 'Failed to fetch users'));
  }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, role } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    user.role = role;
    await user.save();
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, 'Failed to update user role'));
  }
}   

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new ApiError(404, 'User not found');

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, 'Failed to delete user'));
  }
}

export const addUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  
  const { firstName, lastName, phone, dob, email, password, role} = req.body;
  try {
      // Check if user already exists by unique email field
      const user = await User.findOne({ email });
      if (!user){
          // if user does not exist, creates a new user with the provided email and password
          const newUser = new User({ firstName, lastName, phone, dob, email, password, role});
          await newUser.save();
          res.status(201).json({ message: 'User registered successfully' });
          return;
      } else{
          throw new ApiError(400, 'An account with this email already exists');
      }
    } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, 'Failed to add user'));
    }
}