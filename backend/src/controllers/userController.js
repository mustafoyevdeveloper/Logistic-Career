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

    // Jami darslar soni (faqat bir marta hisoblash - faqat order 1-7)
    const totalActiveLessons = await Lesson.countDocuments({ isActive: true, order: { $gte: 1, $lte: 7 } });

    // Har bir o'quvchi uchun statistikalar
    for (const student of students) {
      // Ochilgan darslarni hisoblash - faqat lastAccessed mavjud bo'lgan darslar (order 1-7)
      const allOpenedProgress = await StudentProgress.find({
        studentId: student._id,
        lastAccessed: { $exists: true, $ne: null },
      })
        .select('lessonId')
        .lean();

      const openedLessonIds = [...new Set(allOpenedProgress.map(p => p.lessonId.toString()))];
      
      // Faqat order 1-7 orasidagi darslarni tekshiramiz
      const validLessons = await Lesson.find({
        _id: { $in: openedLessonIds },
        isActive: true,
        order: { $gte: 1, $lte: 7 }
      })
        .select('_id')
        .lean();
      
      const openedLessons = validLessons.length;

      const completedLessons = await StudentProgress.countDocuments({
        studentId: student._id,
        completed: true,
      });

      const aiChats = await ChatMessage.countDocuments({
        studentId: student._id,
        role: 'user',
      });

      const completedAssignments = await AssignmentSubmission.countDocuments({
        studentId: student._id,
        status: 'graded',
      });

      // Ball: har bir ochilgan dars uchun 10 ball (foizda emas)
      const totalScore = openedLessons * 10;

      // Progress foizi - ochilgan darslar foizida
      const progressPercent = totalActiveLessons > 0
        ? Math.round((openedLessons / totalActiveLessons) * 100)
        : 0;

      // Yutuqlar (achievements) hisoblash
      let achievements = 0;
      if (openedLessons >= 1) achievements++; // Birinchi dars
      if (aiChats >= 10) achievements++; // AI suhbatchi
      if (openedLessons >= 7) achievements++; // Izchil o'quvchi

      // Real-time onlayn vaqtni hisoblash (sessionStartTime dan boshlab)
      let onlineTimeFormatted = '00:00:00';
      if (student.sessionStartTime) {
        const now = new Date();
        const diffMs = now.getTime() - new Date(student.sessionStartTime).getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        onlineTimeFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      student.stats = {
        completedLessons,
        totalLessons: totalActiveLessons, // Jami mavjud darslar (7)
        openedLessons, // Ko'rilgan darslar
        aiChats,
        completedAssignments,
        totalScore, // Ball (foizda emas)
        achievements,
        progressPercent, // Progress foizi
        onlineTimeFormatted, // Real-time onlayn vaqt (H:MM:SS formatida, masalan: 2:41:53)
      };

      // student.progress ni yangilash (backward compatibility uchun)
      student.progress = progressPercent;
      
      // sessionStartTime ni qaytarish (frontend'da real-time timer uchun) - ISO string formatida
      student.sessionStartTime = student.sessionStartTime ? new Date(student.sessionStartTime).toISOString() : null;

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

    // Statistikalar bazada saqlangan bo'lsa, ularni olamiz
    const user = await User.findById(studentId).select('stats sessionStartTime').lean();
    let stats = user?.stats || {};
    const sessionStartTime = user?.sessionStartTime || null;

    // Agar statistikalar bazada mavjud bo'lsa va yangi bo'lsa, ularni qaytaramiz
    // Aks holda real-time hisoblaymiz va yangilaymiz
    let openedLessons = stats.openedLessons || 0;
    let totalScore = stats.totalScore || 0;
    let progressPercent = stats.progressPercent || 0;
    let timeSpentMinutes = stats.timeSpentMinutes || 0;
    let aiChats = stats.aiChats || 0;

    // Agar statistikalar eski bo'lsa yoki mavjud emas bo'lsa, yangilaymiz
    // Har safar yangilaymiz (chunki darsga kirilganda statistikalar yangilanadi)
    const shouldUpdate = true; // Har safar yangilaymiz

    if (shouldUpdate) {
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

      timeSpentMinutes = timeSpentResult.length > 0 ? timeSpentResult[0].totalTime : 0;

      // Ochilgan darslarni hisoblash - faqat lastAccessed mavjud bo'lgan darslar
      const allOpenedProgress = await StudentProgress.find({
        studentId,
        lastAccessed: { $exists: true, $ne: null },
      })
        .select('lessonId')
        .lean();

      const openedLessonIds = [...new Set(allOpenedProgress.map(p => p.lessonId))];
      
      // Faqat order 1-7 orasidagi darslarni tekshiramiz
      const validLessons = await Lesson.find({
        _id: { $in: openedLessonIds },
        isActive: true,
        order: { $gte: 1, $lte: 7 }
      })
        .select('_id')
        .lean();
      
      openedLessons = validLessons.length;

      // Ball: har bir ochilgan dars uchun 10 ball (umumiy 70 ball)
      totalScore = openedLessons * 10;
      const maxScore = totalLessons * 10; // 70 ball

      // Progress foizi - ochilgan darslar foizida
      progressPercent = Math.min(
        100,
        Math.round((openedLessons / totalLessons) * 100)
      );

      // AI chatlar soni
      aiChats = await ChatMessage.countDocuments({
        studentId,
        role: 'user',
      });

      // Statistikani bazada yangilash
      await User.findByIdAndUpdate(studentId, {
        'stats.openedLessons': openedLessons,
        'stats.totalLessons': totalLessons,
        'stats.totalScore': totalScore,
        'stats.maxScore': maxScore,
        'stats.progressPercent': progressPercent,
        'stats.timeSpentMinutes': timeSpentMinutes,
        'stats.aiChats': aiChats,
        'stats.lastStatsUpdate': new Date(),
      });
    }

    // O'qish vaqtini soat:daqiqa formatiga o'zgartirish
    const timeSpentHours = Math.floor(timeSpentMinutes / 60);
    const timeSpentMins = timeSpentMinutes % 60;
    const timeSpentFormatted = `${timeSpentHours}:${timeSpentMins.toString().padStart(2, '0')}`;

    // Real-time onlayn vaqtni hisoblash (sessionStartTime dan boshlab)
    let onlineTimeFormatted = '0:00:00';
    if (sessionStartTime) {
      const now = new Date();
      const diffMs = now.getTime() - new Date(sessionStartTime).getTime();
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      onlineTimeFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

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
    achievements.consistentLearner = openedLessons >= 7;

    // Yutuqlar soni (test ustasi olib tashlandi, endi 3 ta yutuq)
    const achievementsCount = Object.values(achievements).filter(Boolean).length;

    res.json({
      success: true,
      data: {
        stats: {
          completedLessons: openedLessons, // Ochilgan darslar (backward compatibility uchun)
          openedLessons, // Ochilgan darslar
          totalLessons,
          timeSpent: timeSpentMinutes, // Daqiqalarda (frontend'da formatlash uchun)
          timeSpentFormatted, // Soat:daqiqa formatida (2:43)
          onlineTimeFormatted, // Real-time onlayn vaqt (H:MM:SS formatida, masalan: 2:41:53)
          totalScore,
          maxScore: totalLessons * 10, // 70 ball
          avgScore: openedLessons > 0 ? 10 : 0, // Har bir ochilgan dars 10 ball
          progressPercent,
          achievementsCount: achievementsCount,
          totalAchievements: 3, // Test ustasi olib tashlandi
          aiChats,
        },
        achievements,
        sessionStartTime: sessionStartTime ? new Date(sessionStartTime).toISOString() : null, // Frontend'da real-time timer uchun (ISO string formatida)
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
 * @desc    Onlayn vaqtni yangilash (Student)
 * @route   PUT /api/auth/me/update-online-time
 * @access  Private (Student)
 */
export const updateOnlineTime = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar onlayn vaqtni yangilashi mumkin',
      });
    }

    const { totalSeconds } = req.body;

    if (totalSeconds === undefined || totalSeconds < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total seconds kiritilishi shart',
      });
    }

    // Onlayn vaqtni yangilash
    await User.findByIdAndUpdate(req.user._id, {
      'stats.totalOnlineTimeSeconds': totalSeconds,
      'stats.lastStatsUpdate': new Date(),
    });

    res.json({
      success: true,
      message: 'Onlayn vaqt muvaffaqiyatli yangilandi',
      data: {
        totalOnlineTimeSeconds: totalSeconds,
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

    // O'rtacha progress: barcha o'quvchilarning progressPercent lari qo'shilgan va o'quvchilar soniga bo'lingan
    const students = await User.find({ role: 'student', isActive: true }).select('_id').lean();
    const totalActiveLessons = await Lesson.countDocuments({ isActive: true, order: { $gte: 1, $lte: 7 } });

    let totalProgressPercent = 0;
    let studentsWithProgress = 0;

    for (const student of students) {
      // Ochilgan darslarni hisoblash - faqat lastAccessed mavjud bo'lgan darslar (order 1-7)
      const allOpenedProgress = await StudentProgress.find({
        studentId: student._id,
        lastAccessed: { $exists: true, $ne: null },
      })
        .select('lessonId')
        .lean();

      const openedLessonIds = [...new Set(allOpenedProgress.map(p => p.lessonId.toString()))];
      
      // Faqat order 1-7 orasidagi darslarni tekshiramiz
      const validLessons = await Lesson.find({
        _id: { $in: openedLessonIds },
        isActive: true,
        order: { $gte: 1, $lte: 7 }
      })
        .select('_id')
        .lean();
      
      const openedLessons = validLessons.length;

      // Progress foizi - ochilgan darslar foizida
      const progressPercent = totalActiveLessons > 0
        ? Math.round((openedLessons / totalActiveLessons) * 100)
        : 0;

      totalProgressPercent += progressPercent;
      studentsWithProgress++;
    }

    const avgProgress = studentsWithProgress > 0 
      ? Math.round(totalProgressPercent / studentsWithProgress)
      : 0;

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

