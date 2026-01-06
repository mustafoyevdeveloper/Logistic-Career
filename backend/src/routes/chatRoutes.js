import express from 'express';
import {
  createSession,
  sendMessage,
  getChatHistory,
  getStudentChats,
  addFeedback,
} from '../controllers/chatController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Barcha route'lar protected

// Student routes
router.post('/session', authorize('student'), createSession);
router.post('/message', authorize('student'), sendMessage);
router.get('/history', getChatHistory);

// Teacher routes
router.get('/students/:studentId', authorize('teacher'), getStudentChats);
router.put('/:messageId/feedback', authorize('teacher'), addFeedback);

export default router;

