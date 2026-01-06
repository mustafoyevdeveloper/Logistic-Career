import Lesson from '../models/Lesson.js';
import LessonModule from '../models/LessonModule.js';
import StudentProgress from '../models/StudentProgress.js';

/**
 * @desc    Barcha modullarni olish
 * @route   GET /api/lessons/modules
 * @access  Private
 */
export const getModules = async (req, res) => {
  try {
    const modules = await LessonModule.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    // Har bir modul uchun progress hisoblash (student uchun)
    if (req.user.role === 'student') {
      for (const module of modules) {
        const lessons = await Lesson.find({ moduleId: module._id, isActive: true })
          .sort({ order: 1 })
          .lean();

        const completedLessons = await StudentProgress.countDocuments({
          studentId: req.user._id,
          moduleId: module._id,
          completed: true,
        });

        module.lessons = lessons;
        module.progress = lessons.length > 0 
          ? Math.round((completedLessons / lessons.length) * 100) 
          : 0;
      }
    } else {
      // Teacher uchun faqat darslar
      for (const module of modules) {
        module.lessons = await Lesson.find({ moduleId: module._id, isActive: true })
          .sort({ order: 1 })
          .lean();
        module.progress = 0;
      }
    }

    res.json({
      success: true,
      data: { modules },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Bitta darsni olish
 * @route   GET /api/lessons/:id
 * @access  Private
 */
export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('moduleId', 'title')
      .lean();

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi',
      });
    }

    // Student uchun progress ma'lumotlari
    let progress = null;
    if (req.user.role === 'student') {
      progress = await StudentProgress.findOne({
        studentId: req.user._id,
        lessonId: lesson._id,
      }).lean();
    }

    res.json({
      success: true,
      data: { lesson, progress },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Darsni tugatish
 * @route   POST /api/lessons/:id/complete
 * @access  Private (Student)
 */
export const completeLesson = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar darsni tugatishi mumkin',
      });
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi',
      });
    }

    // Progress yaratish yoki yangilash
    let progress = await StudentProgress.findOne({
      studentId: req.user._id,
      lessonId: lesson._id,
    });

    if (progress) {
      progress.completed = true;
      progress.completedAt = new Date();
      await progress.save();
    } else {
      progress = await StudentProgress.create({
        studentId: req.user._id,
        lessonId: lesson._id,
        moduleId: lesson.moduleId,
        completed: true,
        completedAt: new Date(),
        lastAccessed: new Date(),
      });
    }

    // User progress yangilash
    await updateUserProgress(req.user._id);

    res.json({
      success: true,
      message: 'Dars muvaffaqiyatli tugatildi',
      data: { progress },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Dars progress yangilash
 * @route   PUT /api/lessons/:id/progress
 * @access  Private (Student)
 */
export const updateLessonProgress = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar progress yangilashi mumkin',
      });
    }

    const { timeSpent } = req.body;
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi',
      });
    }

    let progress = await StudentProgress.findOne({
      studentId: req.user._id,
      lessonId: lesson._id,
    });

    if (progress) {
      progress.lastAccessed = new Date();
      if (timeSpent) progress.timeSpent += timeSpent;
      await progress.save();
    } else {
      progress = await StudentProgress.create({
        studentId: req.user._id,
        lessonId: lesson._id,
        moduleId: lesson.moduleId,
        lastAccessed: new Date(),
        timeSpent: timeSpent || 0,
      });
    }

    res.json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

// Helper: User progress yangilash
const updateUserProgress = async (userId) => {
  try {
    const totalLessons = await Lesson.countDocuments({ isActive: true });
    const completedLessons = await StudentProgress.countDocuments({
      studentId: userId,
      completed: true,
    });

    const progress = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, { progress });

    // Level aniqlash
    let currentLevel = 'Boshlang\'ich';
    if (progress >= 70) currentLevel = 'Yuqori';
    else if (progress >= 40) currentLevel = 'O\'rta';

    await User.findByIdAndUpdate(userId, { currentLevel });
  } catch (error) {
    console.error('Progress yangilash xatosi:', error);
  }
};

