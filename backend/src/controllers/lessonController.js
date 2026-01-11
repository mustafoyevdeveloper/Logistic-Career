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
 * @desc    Dars progress yangilash (day raqami bo'yicha)
 * @route   PUT /api/lessons/day/:day/progress
 * @access  Private (Student)
 */
export const updateLessonProgressByDay = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar progress yangilashi mumkin',
      });
    }

    const { day } = req.params;
    const dayNumber = parseInt(day);
    const { timeSpent } = req.body;

    if (dayNumber < 1 || dayNumber > 7) {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri dars raqami',
      });
    }

    // Darsni topish (barcha darslar orasidan order bo'yicha, xuddi getStudentLessons kabi)
    const allLessons = await Lesson.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
    
    const lesson = allLessons.find(l => l.order === dayNumber);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: `Dars topilmadi (kun: ${dayNumber})`,
      });
    }

    const now = new Date();
    let progress = await StudentProgress.findOne({
      studentId: req.user._id,
      lessonId: lesson._id,
    });

    if (progress) {
      progress.lastAccessed = now;
      if (timeSpent) progress.timeSpent += timeSpent;
      await progress.save();
    } else {
      progress = await StudentProgress.create({
        studentId: req.user._id,
        lessonId: lesson._id,
        moduleId: lesson.moduleId,
        lastAccessed: now,
        timeSpent: timeSpent || 0,
      });
    }

    // Keyingi dars uchun ochilish vaqtini hisoblash (keyingi kuni soat 8:00)
    // Har safar darsga kirilganda keyingi dars keyingi kuni soat 8:00 da ochiladi
    if (dayNumber >= 1 && dayNumber < 7) {
      const nextLessonDay = dayNumber + 1;
      // Keyingi darsni topish (barcha darslar orasidan order bo'yicha, xuddi getStudentLessons kabi)
      const nextLesson = allLessons.find(l => l.order === nextLessonDay);
      
      if (nextLesson) {
        let nextProgress = await StudentProgress.findOne({
          studentId: req.user._id,
          lessonId: nextLesson._id,
        });

        // Keyingi kuni soat 8:00 ni hisoblash
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);

        if (!nextProgress) {
          // Keyingi dars progress'i yo'q bo'lsa, yaratish
          await StudentProgress.create({
            studentId: req.user._id,
            lessonId: nextLesson._id,
            moduleId: nextLesson.moduleId,
            lessonUnlockTime: tomorrow,
          });
        } else {
          // Keyingi dars progress'i mavjud bo'lsa, ochilish vaqtini yangilash
          nextProgress.lessonUnlockTime = tomorrow;
          await nextProgress.save();
        }
      }
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

    const now = new Date();
    let progress = await StudentProgress.findOne({
      studentId: req.user._id,
      lessonId: lesson._id,
    });

    if (progress) {
      progress.lastAccessed = now;
      if (timeSpent) progress.timeSpent += timeSpent;
      await progress.save();
    } else {
      progress = await StudentProgress.create({
        studentId: req.user._id,
        lessonId: lesson._id,
        moduleId: lesson.moduleId,
        lastAccessed: now,
        timeSpent: timeSpent || 0,
      });
    }

    // Keyingi dars uchun ochilish vaqtini hisoblash (keyingi kuni soat 8:00)
    // Har safar darsga kirilganda keyingi dars keyingi kuni soat 8:00 da ochiladi
    const lessonDay = lesson.order || 1;
    if (lessonDay >= 1 && lessonDay < 7) {
      const nextLessonDay = lessonDay + 1;
      // Keyingi darsni topish (xuddi shu modulda)
      const nextLesson = await Lesson.findOne({ 
        moduleId: lesson.moduleId,
        order: nextLessonDay,
        isActive: true 
      }).lean();
      
      if (nextLesson) {
        // Keyingi dars progress'ini tekshirish
        let nextProgress = await StudentProgress.findOne({
          studentId: req.user._id,
          lessonId: nextLesson._id,
        });

        // Keyingi kuni soat 8:00 ni hisoblash
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);

        if (!nextProgress) {
          // Keyingi dars progress'i yo'q bo'lsa, yaratish
          await StudentProgress.create({
            studentId: req.user._id,
            lessonId: nextLesson._id,
            moduleId: nextLesson.moduleId,
            lessonUnlockTime: tomorrow,
          });
        } else {
          // Keyingi dars progress'i mavjud bo'lsa, ochilish vaqtini yangilash
          nextProgress.lessonUnlockTime = tomorrow;
          await nextProgress.save();
        }
      }
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

/**
 * @desc    O'quvchi darslarini olish (ochiq/yopiq holat bilan)
 * @route   GET /api/lessons/student/lessons
 * @access  Private (Student)
 */
export const getStudentLessons = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar darslarni ko\'ra oladi',
      });
    }

    // Barcha darslarni olish (order bo'yicha)
    const allLessons = await Lesson.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    const lessons = [];
    const now = new Date();

    // 1-dars uchun progress'ni tekshirish va yaratish (faqat bir marta)
    const firstLesson = allLessons.find(l => l.order === 1);
    let firstProgress = null;
    
    if (firstLesson) {
      firstProgress = await StudentProgress.findOne({
        studentId: req.user._id,
        lessonId: firstLesson._id,
      });
      
      // Agar 1-dars progress'i yo'q bo'lsa, yaratish
      if (!firstProgress) {
        try {
          firstProgress = await StudentProgress.create({
            studentId: req.user._id,
            lessonId: firstLesson._id,
            moduleId: firstLesson.moduleId,
            lastAccessed: now,
          });
        } catch (error) {
          // Unique constraint error - progress allaqachon yaratilgan
          firstProgress = await StudentProgress.findOne({
            studentId: req.user._id,
            lessonId: firstLesson._id,
          });
        }
      }
    }

    for (let day = 1; day <= 7; day++) {
      const lesson = allLessons.find(l => l.order === day);
      
      if (!lesson) {
        lessons.push({
          day,
          isUnlocked: false,
          unlockTime: null,
          timeRemaining: null,
        });
        continue;
      }

      let isUnlocked = false;
      let unlockTime = null;
      let timeRemaining = null;

      // 1-dars har doim ochiq bo'lishi kerak
      if (day === 1) {
        isUnlocked = true;
      } else {
        // Joriy dars progress'ini tekshirish
        const progress = await StudentProgress.findOne({
          studentId: req.user._id,
          lessonId: lesson._id,
        }).lean();

        if (progress && progress.lessonUnlockTime) {
          unlockTime = progress.lessonUnlockTime;
          if (now >= unlockTime) {
            isUnlocked = true;
          } else {
            timeRemaining = unlockTime.getTime() - now.getTime();
          }
        } else {
          // Agar progress yo'q bo'lsa, oldingi darsga kirilganligini tekshirish
          const previousDay = day - 1;
          const previousLesson = allLessons.find(l => l.order === previousDay);
          
          if (previousLesson) {
            const previousProgress = await StudentProgress.findOne({
              studentId: req.user._id,
              lessonId: previousLesson._id,
            }).lean();

            if (previousProgress && previousProgress.lastAccessed) {
              // Oldingi darsga kirilgan, lekin keyingi dars ochilish vaqti belgilanmagan
              // Bu holatda dars yopiq bo'ladi
              isUnlocked = false;
            }
          }
        }
      }

      lessons.push({
        day,
        isUnlocked,
        unlockTime,
        timeRemaining, // milliseconds
      });
    }

    res.json({
      success: true,
      data: { lessons },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Darsni maxfiy ochish (long press - 2-10 sekund)
 * @route   POST /api/lessons/day/:day/unlock
 * @access  Private (Student)
 */
export const unlockLessonSecret = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar darsni ochishi mumkin',
      });
    }

    const { day } = req.params;
    const dayNumber = parseInt(day);

    if (dayNumber < 1 || dayNumber > 7) {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri dars raqami',
      });
    }

    // Darsni topish (barcha darslar orasidan order bo'yicha)
    const allLessons = await Lesson.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
    
    const lesson = allLessons.find(l => l.order === dayNumber);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Dars topilmadi',
      });
    }

    // Dars progress'ini topish yoki yaratish
    let progress = await StudentProgress.findOne({
      studentId: req.user._id,
      lessonId: lesson._id,
    });

    if (progress) {
      // Darsni ochish (lessonUnlockTime ni hozirgi vaqtga o'rnatish)
      progress.lessonUnlockTime = new Date();
      await progress.save();
    } else {
      // Progress yaratish
      progress = await StudentProgress.create({
        studentId: req.user._id,
        lessonId: lesson._id,
        moduleId: lesson.moduleId,
        lessonUnlockTime: new Date(),
      });
    }

    res.json({
      success: true,
      message: 'Dars muvaffaqiyatli ochildi',
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

