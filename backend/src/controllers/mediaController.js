import multer from 'multer';
import Lesson from '../models/Lesson.js';
import { uploadToR2, deleteFromR2 } from '../services/r2Service.js';

// Multer konfiguratsiyasi (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, cb) => {
    // Video va audio fayllarni qabul qilish
    const allowedMimes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Faqat video va audio fayllar qabul qilinadi'), false);
    }
  },
});

/**
 * @desc    Video yoki audio yuklash
 * @route   POST /api/media/upload/:lessonId
 * @access  Private (Teacher/Admin)
 */
export const uploadMedia = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar va admin media yuklashi mumkin',
      });
    }

    const { lessonId } = req.params;
    const { type, title } = req.body; // type: 'video' yoki 'audio'

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Fayl yuklanmadi',
      });
    }

    // Type'ni tekshirish yoki fayl turidan aniqlash
    let mediaType = type;
    if (!mediaType || (mediaType !== 'video' && mediaType !== 'audio')) {
      // Fayl turidan aniqlash
      if (req.file.mimetype.startsWith('video/')) {
        mediaType = 'video';
      } else if (req.file.mimetype.startsWith('audio/')) {
        mediaType = 'audio';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Type "video" yoki "audio" bo\'lishi kerak',
        });
      }
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi',
      });
    }

    // R2'ga yuklash
    const publicUrl = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Lesson'ga qo'shish
    const mediaItem = {
      url: publicUrl,
      title: title || req.file.originalname,
      uploadedAt: new Date(),
    };

    if (mediaType === 'video') {
      lesson.videos.push(mediaItem);
    } else {
      lesson.audios.push(mediaItem);
    }

    await lesson.save();

    res.json({
      success: true,
      message: `${type === 'video' ? 'Video' : 'Audio'} muvaffaqiyatli yuklandi`,
      data: {
        url: publicUrl,
        type: mediaType,
        title: mediaItem.title,
      },
    });
  } catch (error) {
    console.error('Media upload xatosi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Media yuklashda xatolik',
    });
  }
};

/**
 * @desc    Video yoki audio o'chirish
 * @route   DELETE /api/media/:lessonId/:mediaId
 * @access  Private (Teacher/Admin)
 */
export const deleteMedia = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar va admin media o\'chirishi mumkin',
      });
    }

    const { lessonId, mediaId } = req.params;
    const { type } = req.query; // type: 'video' yoki 'audio'

    if (!type || (type !== 'video' && type !== 'audio')) {
      return res.status(400).json({
        success: false,
        message: 'Type "video" yoki "audio" bo\'lishi kerak',
      });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi',
      });
    }

    let mediaItem = null;
    if (type === 'video') {
      mediaItem = lesson.videos.id(mediaId);
    } else {
      mediaItem = lesson.audios.id(mediaId);
    }

    if (!mediaItem) {
      return res.status(404).json({
        success: false,
        message: `${type === 'video' ? 'Video' : 'Audio'} topilmadi`,
      });
    }

    // R2'dan o'chirish
    try {
      await deleteFromR2(mediaItem.url);
    } catch (error) {
      console.error('R2 delete xatosi:', error);
      // R2'dan o'chirishda xatolik bo'lsa ham, MongoDB'dan o'chirishni davom ettiramiz
    }

    // MongoDB'dan o'chirish
    if (type === 'video') {
      lesson.videos.pull(mediaId);
    } else {
      lesson.audios.pull(mediaId);
    }

    await lesson.save();

    res.json({
      success: true,
      message: `${type === 'video' ? 'Video' : 'Audio'} muvaffaqiyatli o'chirildi`,
    });
  } catch (error) {
    console.error('Media delete xatosi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Media o\'chirishda xatolik',
    });
  }
};

/**
 * @desc    Video yoki audio yangilash (title)
 * @route   PUT /api/media/:lessonId/:mediaId
 * @access  Private (Teacher/Admin)
 */
export const updateMedia = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar va admin media yangilashi mumkin',
      });
    }

    const { lessonId, mediaId } = req.params;
    const { type, title } = req.body; // type: 'video' yoki 'audio'

    if (!type || (type !== 'video' && type !== 'audio')) {
      return res.status(400).json({
        success: false,
        message: 'Type "video" yoki "audio" bo\'lishi kerak',
      });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi',
      });
    }

    let mediaItem = null;
    if (type === 'video') {
      mediaItem = lesson.videos.id(mediaId);
    } else {
      mediaItem = lesson.audios.id(mediaId);
    }

    if (!mediaItem) {
      return res.status(404).json({
        success: false,
        message: `${type === 'video' ? 'Video' : 'Audio'} topilmadi`,
      });
    }

    // Title yangilash
    if (title) {
      mediaItem.title = title;
    }

    await lesson.save();

    res.json({
      success: true,
      message: `${type === 'video' ? 'Video' : 'Audio'} muvaffaqiyatli yangilandi`,
      data: {
        url: mediaItem.url,
        title: mediaItem.title,
        type,
      },
    });
  } catch (error) {
    console.error('Media update xatosi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Media yangilashda xatolik',
    });
  }
};

// Multer middleware export
export { upload };
