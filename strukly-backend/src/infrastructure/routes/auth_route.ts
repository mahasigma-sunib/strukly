// src/infrastructure/routes/auth_routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth_middleware'; // Import the middleware
import { ProfileController } from '../controllers/profile_controller'; // Import the new controller
// ... all your other imports and wiring

const profileController = new ProfileController();
const router = Router();

// --- Public Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// --- Protected Route ---
// The authMiddleware is placed right before the controller method.
// The request will only reach getProfile if the token is valid.
router.get('/auth/profile', authMiddleware, profileController.getProfile);

export { router as authRouter };