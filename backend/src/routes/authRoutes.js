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
import { protect, authorize } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('?role=student', validateLogin, login);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/logout', protect, logout);
router.post('/create-student', protect, authorize('teacher', 'admin'), createStudent);

export default router;

