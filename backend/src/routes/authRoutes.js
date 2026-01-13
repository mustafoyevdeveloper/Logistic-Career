import express from 'express';
import {
  register,
  login,
  adminLogin,
  getMe,
  updateProfile,
  updatePassword,
  logout,
  createStudent,
} from '../controllers/authController.js';
import { getMyStats, updateOnlineTime, pauseStart, pauseEnd } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.get('/me/stats', protect, authorize('student'), getMyStats);
router.put('/me/update-online-time', protect, authorize('student'), updateOnlineTime);
router.post('/me/pause-start', protect, authorize('student'), pauseStart);
router.post('/me/pause-end', protect, authorize('student'), pauseEnd);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/logout', protect, logout);
router.post('/create-student', protect, authorize('teacher', 'admin'), createStudent);

export default router;

