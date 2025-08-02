import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/apiError';
import prisma from '../prisma'; // Import Prisma client

export const getUserLoadouts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get mongoUserID from query string for GET requests
        const mongoUserID = req.query.mongoUserID as string;
        if (!mongoUserID) {
            throw new ApiError(400, 'User ID is required');
        }
        // Fetch user loadouts from postgres where mongo_id matches
        const userLoadouts = await prisma.user_loadouts.findMany({
            where: { mongo_id: mongoUserID }
        });
        if (!userLoadouts) {
            throw new ApiError(404, 'User loadouts not found');
        }
        // Respond with user loadouts data
        res.status(200).json(userLoadouts);
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to fetch user loadouts'));
    }
}

export const updateUserLoadoutFoundation = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {mongoUserID, loadoutId, newFoundationID} = req.body;
        if (!mongoUserID || !newFoundationID) {
            throw new ApiError(400, 'User ID and new foundation ID are required');
        }
        // Update user loadout foundation in postgres where mongo_id matches
        const updatedLoadout = await prisma.user_loadouts.update({
            where: { 
                mongo_id: mongoUserID,
                id: loadoutId
            },
            data: { foundation_shade_id: newFoundationID }
        });
        if (!updatedLoadout) {
            throw new ApiError(404, 'User loadout not found');
        }
        res.status(200).json({ message: 'Loadout foundation updated successfully' });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to update loadout foundation'));
    }
}

export const updateUserLoadoutName = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {mongoUserID, loadoutId, newLoadoutName} = req.body;
        if (!mongoUserID || !newLoadoutName) {
            throw new ApiError(400, 'User ID and new loadout name are required');
        }
        // Update user loadout name in postgres where mongo_id matches
        const updatedLoadout = await prisma.user_loadouts.update({
            where: { 
                mongo_id: mongoUserID,
                id: loadoutId
            },
            data: { name: newLoadoutName }
        });
        if (!updatedLoadout) {
            throw new ApiError(404, 'User loadout not found');
        }
        res.status(200).json({ message: 'Loadout name updated successfully' });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to update loadout name'));
    }
}

export const deleteUserLoadout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { mongoUserID, loadoutId } = req.body;
        if (!mongoUserID || !loadoutId) {
            throw new ApiError(400, 'User ID and loadout ID are required');
        }
        // Delete user loadout in postgres where mongo_id matches
        const deletedLoadout = await prisma.user_loadouts.delete({
            where: { 
                mongo_id: mongoUserID,
                id: loadoutId
            }
        });
        if (!deletedLoadout) {
            throw new ApiError(404, 'User loadout not found');
        }
        res.status(200).json({ message: 'Loadout deleted successfully' });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to delete loadout'));
    }
}

export const createUserLoadout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { mongoUserID, loadoutName, foundationShadeID } = req.body;
        if (!mongoUserID || !loadoutName || !foundationShadeID) {
            throw new ApiError(400, 'User ID, loadout name, and foundation shade ID are required');
        }
        // Create a new user loadout in postgres
        const newLoadout = await prisma.user_loadouts.create({
            data: {
                mongo_id: mongoUserID,
                name: loadoutName,
                foundation_shade_id: foundationShadeID
            }
        });
        res.status(201).json(newLoadout);
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to create loadout'));
    }
}