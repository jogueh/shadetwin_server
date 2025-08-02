import express from 'express';
import { getAllUsers, updateUserRole, deleteUser, addUser } from '../controllers/userManagementController';
import { asyncHandler } from '../middleware/asyncHandler';
// Optionally, add authentication/authorization middleware here

const router = express.Router();

// Get all users
router.get('/get-all-users', asyncHandler(getAllUsers));
// Update user role
router.put('/update-role', asyncHandler(updateUserRole));
// Delete user
router.delete('/delete-user', asyncHandler(deleteUser));
// Add user
router.post('/add-user', asyncHandler(addUser));

export default router;
