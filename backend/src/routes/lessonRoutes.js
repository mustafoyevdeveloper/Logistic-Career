import express from 'express';
import {
  getModules,
  getLesson,
  completeLesson,
  updateLessonProgress,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Barcha route'lar protected

router.get('/modules', getModules);
router.get('/:id', getLesson);
router.post('/:id/complete', completeLesson);
router.put('/:id/progress', updateLessonProgress);

export default router;

