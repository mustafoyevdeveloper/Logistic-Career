import User from '../models/User.js';
import StudentProgress from '../models/StudentProgress.js';
import ChatMessage from '../models/ChatMessage.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';

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
    let query = { role: 'student', isActive: true };

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

