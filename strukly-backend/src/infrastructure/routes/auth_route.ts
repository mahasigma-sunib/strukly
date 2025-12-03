import { Router } from 'express';
import AuthController from '../controllers/auth_controller';
import ProfileController from '../controllers/profile_controller';
import { authMiddleware } from '../middleware/auth_middleware';
import {
  userRepository,
  tokenService,
  registerUserUseCase,
  loginUserUseCase,
  updateUserProfileUseCase,
} from "src/composition_root";

// inject dependency
const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  tokenService
);
const profileController = new ProfileController(updateUserProfileUseCase, userRepository);

//setup router
const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authMiddleware, authController.logout);

// protected
router.get('/auth/profile', authMiddleware, profileController.getProfile);
router.patch('/auth/profile', authMiddleware, profileController.updateProfile);

export { router as authRouter };
