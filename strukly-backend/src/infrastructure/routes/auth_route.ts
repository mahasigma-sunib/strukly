import { Router } from 'express';
import BcryptService from '../services/bcrypt_service';
import JwtService from '../services/jwt_service';
import PrismaUserRepository from '../repositories/prisma_user_repository';
import RegisterUserUseCase from '../../application/use_cases/register_user';
import LoginUserUseCase from '../../application/use_cases/user_login';
import AuthController from '../controllers/auth_controller';
import ProfileController from '../controllers/profile_controller';
import { authMiddleware } from '../middleware/auth_middleware';

// setup
const hashingService = new BcryptService();
const tokenService = new JwtService();
const userRepository = new PrismaUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository, hashingService);
const loginUserUseCase = new LoginUserUseCase(userRepository, hashingService);

// inject dependency
const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  tokenService
);
const profileController = new ProfileController();

//setup router
const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// protected
router.get('/auth/profile', authMiddleware, profileController.getProfile);


export { router as authRouter };