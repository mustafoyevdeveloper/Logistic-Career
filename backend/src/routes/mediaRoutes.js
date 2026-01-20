import express from 'express';
import { uploadMedia, deleteMedia, updateMedia, upload } from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Barcha route'lar protected

// Media yuklash (single file)
router.post('/upload/:lessonId', upload.single('file'), uploadMedia);

// Media o'chirish
router.delete('/:lessonId/:mediaId', deleteMedia);

// Media yangilash
router.put('/:lessonId/:mediaId', updateMedia);

export default router;
