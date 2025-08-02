import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { changeUserBudget, changeUserSkinType, getProfile, initProfile } from '../controllers/userProfileController';

const router = express.Router();

router.post("/init", asyncHandler(initProfile));
router.get("/get", asyncHandler(getProfile));
router.post("/change-skin-type", asyncHandler(changeUserSkinType));
router.post("/change-user-budget", asyncHandler(changeUserBudget));
export default router;