import express from 'express';
import {
  getModules,
  getLesson,
  getLessonByDay,
  completeLesson,
  updateLessonProgress,
  updateLessonProgressByDay,
  getStudentLessons,
  unlockLessonSecret,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Debug middleware - route'lar ishlayotganini tekshirish
router.use((req, res, next) => {
  console.log(`[LessonRoutes] ${req.method} ${req.path}`);
  next();
});

router.use(protect); // Barcha route'lar protected

// Muhim: Specific route'lar generic route'lardan oldin bo'lishi kerak
router.get('/modules', getModules);
router.get('/student/lessons', getStudentLessons);
// Day route'larini aniqroq qilish
router.get('/day/:day', getLessonByDay); // Day bo'yicha lesson olish
router.put('/day/:day/progress', updateLessonProgressByDay);
router.post('/day/:day/unlock', unlockLessonSecret);
// Generic route'lar oxirida
router.get('/:id', getLesson);
router.post('/:id/complete', completeLesson);
router.put('/:id/progress', updateLessonProgress);

export default router;

