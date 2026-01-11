import User from '../models/User.js';
import StudentProgress from '../models/StudentProgress.js';
import ChatMessage from '../models/ChatMessage.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Lesson from '../models/Lesson.js';
import mongoose from 'mongoose';

/**
 * @desc    Barcha o'quvchilarni olish (Teacher)
 * @route   GET /api/users/students
 * @access  Private (Teacher)
 */
export const getStudents = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin o\'quvchilarni ko\'ra oladi',
      });
    }

    const { group, search } = req.query;
    let query = { role: 'student', isActive: true }; // Faqat faol o'quvchilarni ko'rsatish

    if (group) {
      query.group = group;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Har bir o'quvchi uchun statistikalar
    for (const student of students) {
      const completedLessons = await StudentProgress.countDocuments({
        studentId: student._id,
        completed: true,
      });

      const totalLessons = await StudentProgress.countDocuments({
        studentId: student._id,
      });

      const aiChats = await ChatMessage.countDocuments({
        studentId: student._id,
        role: 'user',
      });

      const completedAssignments = await AssignmentSubmission.countDocuments({
        studentId: student._id,
        status: 'graded',
      });

      const avgScore = await AssignmentSubmission.aggregate([
        {
          $match: {
            studentId: student._id,
            status: 'graded',
            score: { $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$score' },
          },
        },
      ]);

      student.stats = {
        completedLessons,
        totalLessons,
        aiChats,
        completedAssignments,
        avgScore: avgScore.length > 0 ? Math.round(avgScore[0].avgScore) : 0,
      };

      // Last active
      const lastChat = await ChatMessage.findOne({ studentId: student._id })
        .sort({ createdAt: -1 })
        .lean();

      student.lastActive = lastChat?.createdAt || student.lastLogin || student.createdAt;
    }

    res.json({
      success: true,
      data: { students },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Bitta o'quvchi ma'lumotlari (Teacher)
 * @route   GET /api/users/students/:id
 * @access  Private (Teacher)
 */
export const getStudent = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin o\'quvchi ma\'lumotlarini ko\'ra oladi',
      });
    }

    const student = await User.findById(req.params.id).select('-password').lean();

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    // Progress ma'lumotlari
    const progress = await StudentProgress.find({ studentId: student._id })
      .populate('lessonId', 'title')
      .populate('moduleId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    // Chat sessiyalari soni
    const chatSessions = await ChatMessage.distinct('sessionId', {
      studentId: student._id,
    });

    // Topshiriqlar
    const assignments = await AssignmentSubmission.find({ studentId: student._id })
      .populate('assignmentId', 'title description type dueDate maxScore')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        student,
        progress,
        chatSessions: chatSessions.length,
        assignments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchi guruhlarini olish
 * @route   GET /api/users/groups
 * @access  Private (Teacher)
 */
/**
 * @desc    Sozlamalarni olish
 * @route   GET /api/users/settings
 * @access  Private (Teacher/Admin)
 */
export const getSettings = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin sozlamalarni ko\'ra oladi',
      });
    }

    // User'dan sozlamalarni olish
    const user = await User.findById(req.user._id).select('settings');
    
    const defaultSettings = {
      emailNotifications: true,
      newAssignmentNotifications: true,
      aiGrading: true,
      showAiScores: true,
    };

    res.json({
      success: true,
      data: {
        settings: user.settings || defaultSettings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Sozlamalarni yangilash
 * @route   PUT /api/users/settings
 * @access  Private (Teacher/Admin)
 */
export const updateSettings = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin sozlamalarni yangilashi mumkin',
      });
    }

    const { emailNotifications, newAssignmentNotifications, aiGrading, showAiScores } = req.body;

    const user = await User.findById(req.user._id);
    
    user.settings = {
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.settings?.emailNotifications ?? true,
      newAssignmentNotifications: newAssignmentNotifications !== undefined ? newAssignmentNotifications : user.settings?.newAssignmentNotifications ?? true,
      aiGrading: aiGrading !== undefined ? aiGrading : user.settings?.aiGrading ?? true,
      showAiScores: showAiScores !== undefined ? showAiScores : user.settings?.showAiScores ?? true,
    };

    await user.save();

    res.json({
      success: true,
      message: 'Sozlamalar muvaffaqiyatli yangilandi',
      data: {
        settings: user.settings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

export const getGroups = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin guruhlarni ko\'ra oladi',
      });
    }

    const groups = await User.distinct('group', {
      role: 'student',
      isActive: true,
      group: { $ne: null },
    });

    res.json({
      success: true,
      data: { groups },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchi statistikalarini olish (Student)
 * @route   GET /api/users/me/stats
 * @access  Private (Student)
 */
export const getMyStats = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar o\'z statistikalarini ko\'ra oladi',
      });
    }

    const studentId = req.user._id;
    const totalLessons = 7; // Doimiy 7 ta dars

    // Ochilgan darslar statistikasi to'g'ri hisoblanadi (quyidagi kodda)

    // O'qish vaqti (daqiqalarda) - o'quvchi saytda necha soat onlayn bo'lgan
    const timeSpentResult = await StudentProgress.aggregate([
      {
        $match: { studentId },
      },
      {
        $group: {
          _id: null,
          totalTime: { $sum: '$timeSpent' },
        },
      },
    ]);

    const timeSpentMinutes = timeSpentResult.length > 0 ? timeSpentResult[0].totalTime : 0;
    
    // O'qish vaqtini soat:daqiqa formatiga o'zgartirish (backend'da faqat daqiqalarni qaytarish, frontend'da formatlash)
    // Lekin backward compatibility uchun soat:daqiqa formatini ham qaytaramiz
    const timeSpentHours = Math.floor(timeSpentMinutes / 60);
    const timeSpentMins = timeSpentMinutes % 60;
    const timeSpentFormatted = `${timeSpentHours}:${timeSpentMins.toString().padStart(2, '0')}`;

    // Ochilgan darslarni hisoblash - faqat lastAccessed mavjud bo'lgan darslar
    // Oddiy va aniq yondashuv: faqat lastAccessed mavjud bo'lgan progress'lar
    // Va ularga tegishli darslar order 1-7 orasida bo'lishi kerak
    
    // Barcha lastAccessed mavjud bo'lgan progress'larni olamiz
    const allOpenedProgress = await StudentProgress.find({
      studentId,
      lastAccessed: { $exists: true, $ne: null },
    })
      .select('lessonId')
      .lean();
    
    // Progress'larga tegishli dars ID'larini olamiz (unique qilish uchun Set ishlatamiz)
    const openedLessonIds = [...new Set(allOpenedProgress.map(p => p.lessonId))];
    
    // Faqat order 1-7 orasidagi darslarni tekshiramiz
    const validLessons = await Lesson.find({
      _id: { $in: openedLessonIds },
      isActive: true,
      order: { $gte: 1, $lte: 7 }
    })
      .select('_id')
      .lean();
    
    const validOpenedLessons = validLessons.length;

    // Ball: har bir ochilgan dars uchun 10 ball (umumiy 70 ball)
    const totalScore = validOpenedLessons * 10;
    const maxScore = totalLessons * 10; // 70 ball

    // Progress foizi - ochilgan darslar foizida
    const progressPercent = Math.min(
      100,
      Math.round((validOpenedLessons / totalLessons) * 100)
    );

    // AI chatlar soni
    const aiChats = await ChatMessage.countDocuments({
      studentId,
      role: 'user',
    });

    // Yutuqlar (achievements)
    const achievements = {
      firstLesson: false,
      aiChatter: false,
      consistentLearner: false,
    };

    // Birinchi dars - 1-dars ochilgan bo'lsa
    const firstLesson = await Lesson.findOne({ order: 1, isActive: true }).lean();
    if (firstLesson) {
      const firstLessonProgress = await StudentProgress.findOne({
        studentId,
        lessonId: firstLesson._id,
        lastAccessed: { $exists: true, $ne: null },
      }).lean();
      achievements.firstLesson = !!firstLessonProgress;
    }

    // AI suhbatchi - 10 marta AI bilan suhbatlashgan bo'lsa
    achievements.aiChatter = aiChats >= 10;

    // Izchil o'quvchi - 7 ta dars ochilgan bo'lsa
    achievements.consistentLearner = validOpenedLessons >= 7;

    // Yutuqlar soni (test ustasi olib tashlandi, endi 3 ta yutuq)
    const achievementsCount = Object.values(achievements).filter(Boolean).length;

    res.json({
      success: true,
      data: {
        stats: {
          completedLessons: validOpenedLessons, // Ochilgan darslar (backward compatibility uchun)
          openedLessons: validOpenedLessons, // Ochilgan darslar
          totalLessons,
          timeSpent: timeSpentMinutes, // Daqiqalarda (frontend'da formatlash uchun)
          timeSpentFormatted, // Soat:daqiqa formatida (2:43)
          totalScore,
          maxScore,
          avgScore: validOpenedLessons > 0 ? 10 : 0, // Har bir ochilgan dars 10 ball
          progressPercent,
          achievementsCount: achievementsCount,
          totalAchievements: 3, // Test ustasi olib tashlandi
          aiChats,
        },
        achievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'qituvchi statistikalarini olish (Teacher/Admin)
 * @route   GET /api/users/teacher/stats
 * @access  Private (Teacher/Admin)
 */
export const getTeacherStats = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin statistikalarni ko\'ra oladi',
      });
    }

    // Jami o'quvchilar (faqat faol)
    const totalStudents = await User.countDocuments({
      role: 'student',
      isActive: true,
    });

    // Faol darslar doimiy 7 ta
    const activeLessons = 7;

    // O'rtacha progress: barcha o'quvchilarning tugatilgan darslari o'rtacha foizi (100/7 har dars)
    // StudentProgress'da completed=true bo'lganlarni hisoblaymiz
    const progressAgg = await StudentProgress.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: '$studentId',
          completedCount: { $sum: 1 },
        },
      },
      {
        $project: {
          percent: {
            $min: [
              { $multiply: [{ $divide: ['$completedCount', 7] }, 100] },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$percent' },
        },
      },
    ]);

    const avgProgress = progressAgg.length > 0 ? Math.round(progressAgg[0].avgProgress || 0) : 0;

    // AI suhbatlar: barcha o'quvchilar ChatMessage (role: user) soni
    const totalChats = await ChatMessage.countDocuments({ role: 'user' });

    res.json({
      success: true,
      data: {
        totalStudents,
        activeLessons,
        avgProgress,
        totalChats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

