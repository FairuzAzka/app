import express from 'express';
import {
  getAllUsers,
  createUser,
  Login,
  Logout
} from '../controllers/userController.js';
import { refreshToken } from '../controllers/RefreshTokenControllers.js';
import {verifyToken} from '../middleware/verifyToken.js';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/users', verifyToken, getAllUsers);
router.post('/createUsers', createUser);
router.post('/login', Login);
router.post('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
