import express from 'express';
import {
  getStudents,
  getStudent,
  getGroups,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Barcha route'lar protected
router.use(authorize('teacher', 'admin')); // Teacher va admin

router.get('/students', getStudents);
router.get('/students/:id', getStudent);
router.get('/groups', getGroups);

export default router;

