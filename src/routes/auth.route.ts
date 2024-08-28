import { Router } from 'express';
import { loginController, refreshTokenController, registerController, verifyPasswordController } from '~/controllers/auth.controller';
import { checkEmailExistence } from '~/middlewares/authMiddleware';

const authRoutes = Router();
authRoutes.post('/login', loginController);
authRoutes.post('/register',checkEmailExistence,registerController)
authRoutes.post('/token', refreshTokenController);
authRoutes.get('/verify-password/:token',verifyPasswordController)
export default authRoutes;

