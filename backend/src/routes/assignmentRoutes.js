import express from 'express';
import {
  getAssignments,
  getAssignment,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  getStudentAssignments,
  getAssignmentSubmissions,
  getAllSubmissions,
  saveQuizAnswer,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Barcha route'lar protected

// Specific routes first (before parameterized routes)
router.get('/', getAssignments);
router.get('/all-submissions', authorize('teacher', 'admin'), getAllSubmissions);
router.get('/student/:studentId', authorize('teacher', 'admin'), getStudentAssignments);

// Parameterized routes
router.get('/:id', getAssignment);
router.get('/:id/submissions', authorize('teacher', 'admin'), getAssignmentSubmissions);
router.post('/', authorize('teacher', 'admin'), createAssignment);
router.post('/:id/answer', authorize('student'), saveQuizAnswer);
router.post('/:id/submit', authorize('student'), submitAssignment);
router.put('/:id/grade', authorize('teacher', 'admin'), gradeSubmission);

export default router;

