import express from 'express';
import {
  deleteStudent,
  suspendStudent,
  updateStudent,
  clearStudentDevice,
  uploadStudentCertificate,
  certificateUpload,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('teacher', 'admin'));

router.delete('/:id', deleteStudent);
router.put('/:id/suspend', suspendStudent);
router.put('/:id', updateStudent);
router.post('/:id/clear-device', clearStudentDevice);
router.post('/:id/certificate', (req, res, next) => {
  certificateUpload(req, res, (err) => {
    if (err) {
      console.error('[studentRoutes] Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Fayl yuklashda xatolik',
      });
    }
    next();
  });
}, uploadStudentCertificate);

export default router;

