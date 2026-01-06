import express from 'express';
import {
  getAssignments,
  getAssignment,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  getStudentAssignments,
  getAssignmentSubmissions,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Barcha route'lar protected

router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.post('/', authorize('teacher'), createAssignment);
router.post('/:id/submit', authorize('student'), submitAssignment);
router.put('/:id/grade', authorize('teacher'), gradeSubmission);
router.get('/student/:studentId', authorize('teacher'), getStudentAssignments);
router.get('/:id/submissions', authorize('teacher'), getAssignmentSubmissions);

export default router;

