import express from 'express';
import {
  deleteStudent,
  suspendStudent,
  updateStudent,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('teacher', 'admin'));

router.delete('/:id', deleteStudent);
router.put('/:id/suspend', suspendStudent);
router.put('/:id', updateStudent);

export default router;

