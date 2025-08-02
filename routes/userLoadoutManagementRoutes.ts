import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { createUserLoadout, deleteUserLoadout, getUserLoadouts, updateUserLoadoutFoundation, updateUserLoadoutName } from '../controllers/userLoadoutManagementController';

const router = express.Router();

router.get('/get-loadouts', asyncHandler(getUserLoadouts));
router.post('/update-loadout-foundation', asyncHandler(updateUserLoadoutFoundation)); 
router.post("/update-loadout-name", asyncHandler(updateUserLoadoutName));
router.post("/delete-loadout", asyncHandler(deleteUserLoadout));
router.post("/create-loadout", asyncHandler(createUserLoadout));
export default router;