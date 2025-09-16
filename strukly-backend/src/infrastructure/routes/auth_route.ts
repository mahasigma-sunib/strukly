import { Router } from 'express';
import { authMiddleware } from '../middleware/auth_middleware';
import ProfileController from '../controllers/profile_controller';

const profileController = new ProfileController();
const router = Router();
