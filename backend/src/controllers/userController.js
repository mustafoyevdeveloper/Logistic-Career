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

    // Darslar statistikasi
    const completedLessons = await StudentProgress.countDocuments({
      studentId,
      completed: true,
    });

    // O'qish vaqti (daqiqalarda)
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
    const timeSpentHours = Math.round((timeSpentMinutes / 60) * 10) / 10; // 1 xona aniqlik

    // Ball: har bir dars 10 ball
    const totalScore = completedLessons * 10;
    const maxScore = totalLessons * 10;
    const avgScore = completedLessons > 0 ? 10 : 0;

    // Progress foizi
    const progressPercent = Math.min(
      100,
      Math.round((completedLessons / totalLessons) * 100)
    );

    // Yutuqlar (achievements) - oddiy logika
    const achievements = {
      firstLesson: completedLessons > 0,
      testMaster: scoreResult.length > 0 && scoreResult[0].count >= 3,
      aiChatter: false, // ChatMessage count qilish kerak
      consistentLearner: false, // 7 kun ketma-ket o'qish
    };

    // AI chatlar soni
    const aiChats = await ChatMessage.countDocuments({
      studentId,
      role: 'user',
    });

    achievements.aiChatter = aiChats >= 10;

    // Yutuqlar soni
    const achievementsCount = Object.values(achievements).filter(Boolean).length;

    res.json({
      success: true,
      data: {
        stats: {
          completedLessons,
          totalLessons,
          timeSpent: timeSpentHours,
          totalScore,
          maxScore,
          avgScore,
          progressPercent,
          achievementsCount: achievementsCount,
          totalAchievements: 4,
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

