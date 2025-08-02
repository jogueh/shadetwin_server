import e, { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/apiError';
import prisma from '../prisma';

export const initProfile = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Initialize user profile in the database
        const { mongoUserID, budget, skintype} = req.body; // Assuming userId is passed in the request body
        if (!mongoUserID) {
            throw new ApiError(400, 'User ID is required');
        }
        
        // Update user profile in postgres where mongo_id matches
        const updateUser = await prisma.user_profiles.update({
            where: { mongo_id: mongoUserID },
            data: { 
                budget: budget, 
                skin_type: skintype 
            }
        });
        if (!updateUser) {
            throw new ApiError(404, 'User profile not found');
        }
        // Respond with success message
        res.status(201).json({ message: 'User profile updated successfully' });
    } catch (err) {
        if (err instanceof ApiError) {
        return next(err);
        }
        next(new ApiError(500, 'Failed to initialize user profile'));
    }
}

export const getProfile = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get mongoUserID from query string for GET requests
        const mongoUserID = req.query.mongoUserID as string;
        if (!mongoUserID) {
            throw new ApiError(400, 'User ID is required');
        }
        // Fetch user profile from postgres where mongo_id matches
        const userProfile = await prisma.user_profiles.findUnique({
            where: { mongo_id: mongoUserID }
        });
        if (!userProfile) {
            throw new ApiError(404, 'User profile not found');
        }
        // Respond with user profile data
        res.status(200).json(userProfile);
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to fetch user profile'));
    }
}

export const changeUserSkinType = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { mongoUserID, newSkinType } = req.body;
        if (!mongoUserID || !newSkinType) {
            throw new ApiError(400, 'User ID and new skin type are required');
        }
        // rate-limit the request to prevent abuse (dont want to run update w/ same val)
        // Update user skin type in postgres where mongo_id matches
        const updatedProfile = await prisma.user_profiles.update({
            where: { mongo_id: mongoUserID },
            data: { skin_type: newSkinType }
        });
        
        if (!updatedProfile) {
            throw new ApiError(404, 'User profile not found');
        }
        
        res.status(200).json({ message: 'Skin type updated successfully' });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to update skin type'));
    }
}

export const changeUserBudget = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { mongoUserID, newBudget } = req.body;
        if (!mongoUserID || newBudget === undefined) {
            throw new ApiError(400, 'User ID and new budget are required');
        }
        
        // Update user budget in postgres where mongo_id matches
        const updatedProfile = await prisma.user_profiles.update({
            where: { mongo_id: mongoUserID },
            data: { budget: newBudget }
        });
        
        if (!updatedProfile) {
            throw new ApiError(404, 'User profile not found');
        }
        
        res.status(200).json({ message: 'Budget updated successfully' });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to update budget'));
    }
}