import express, { Request, Response, NextFunction } from 'express';
// TypeScript types for the request/response objects and the next() function
import { forgotPassword, login, register, resetPassword, resetPasswordWithToken} from '../controllers/authController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authMiddleware';
// login function, async and returns a Promise

// This is like a mini Express app that you use to define routes modularly (e.g., authRoutes.ts).
const router = express.Router();

// This route handles POST requests to /auth/login
router.post('/login', asyncHandler(login));
router.post('/register', asyncHandler(register)); 
router.post("/reset-password", asyncHandler(resetPassword));
//router.post('/reset-password', asyncHandler(resetPassword)); 
router.post("/forgot-password", asyncHandler(forgotPassword))
router.post("/reset-password-with-token", asyncHandler(resetPasswordWithToken));
router.get('/get-current-user', authenticate as any, (req: Request, res: Response) => {
  const user = (req as any).user; // Type assertion to access user property
  res.json({ user });
});

// exports the router so it can be used in app.ts
export default router;
