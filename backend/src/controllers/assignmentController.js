import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import { gradeAssignment } from '../services/aiService.js';

/**
 * @desc    Barcha topshiriqlarni olish
 * @route   GET /api/assignments
 * @access  Private
 */
export const getAssignments = async (req, res) => {
  try {
    let query = { isActive: true };

    // Student faqat o'z topshiriqlarini ko'radi
    if (req.user.role === 'student') {
      // Barcha topshiriqlar (umumiy va o'quvchi uchun)
    }

    const assignments = await Assignment.find(query)
      .populate('lessonId', 'title')
      .populate('moduleId', 'title')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();

    // Student uchun submission ma'lumotlari
    if (req.user.role === 'student') {
      for (const assignment of assignments) {
        const submission = await AssignmentSubmission.findOne({
          assignmentId: assignment._id,
          studentId: req.user._id,
        }).lean();

        assignment.submission = submission || null;
        assignment.status = submission?.status || 'pending';
        assignment.score = submission?.score || null;
      }
    }

    res.json({
      success: true,
      data: { assignments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Bitta topshiriqni olish
 * @route   GET /api/assignments/:id
 * @access  Private
 */
export const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('lessonId', 'title')
      .populate('moduleId', 'title')
      .populate('createdBy', 'firstName lastName')
      .lean();

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Topshiriq topilmadi',
      });
    }

    // Student uchun submission
    let submission = null;
    if (req.user.role === 'student') {
      submission = await AssignmentSubmission.findOne({
        assignmentId: assignment._id,
        studentId: req.user._id,
      }).lean();
    }

    res.json({
      success: true,
      data: { assignment, submission },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Topshiriq yaratish (Teacher)
 * @route   POST /api/assignments
 * @access  Private (Teacher)
 */
export const createAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar topshiriq yaratishi mumkin',
      });
    }

    const assignment = await Assignment.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Topshiriq muvaffaqiyatli yaratildi',
      data: { assignment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Topshiriqni yuborish (Student)
 * @route   POST /api/assignments/:id/submit
 * @access  Private (Student)
 */
export const submitAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar topshiriq yuborishi mumkin',
      });
    }

    const { answers } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Topshiriq topilmadi',
      });
    }

    // Submission mavjudligini tekshirish
    let submission = await AssignmentSubmission.findOne({
      assignmentId: assignment._id,
      studentId: req.user._id,
    });

    if (submission && submission.status === 'graded') {
      return res.status(400).json({
        success: false,
        message: 'Bu topshiriq allaqachon baholangan',
      });
    }

    // AI tomonidan dastlabki baholash
    let aiScore = null;
    try {
      aiScore = await gradeAssignment(assignment, answers);
    } catch (error) {
      console.error('AI baholash xatosi:', error);
    }

    if (submission) {
      submission.answers = answers;
      submission.status = 'submitted';
      submission.submittedAt = new Date();
      submission.aiScore = aiScore;
      await submission.save();
    } else {
      submission = await AssignmentSubmission.create({
        assignmentId: assignment._id,
        studentId: req.user._id,
        answers,
        status: 'submitted',
        submittedAt: new Date(),
        aiScore,
      });
    }

    res.json({
      success: true,
      message: 'Topshiriq muvaffaqiyatli yuborildi',
      data: { submission },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Topshiriqni baholash (Teacher)
 * @route   PUT /api/assignments/:id/grade
 * @access  Private (Teacher)
 */
export const gradeSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar baholash mumkin',
      });
    }

    const { submissionId, score, feedback } = req.body;

    if (!submissionId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID va ball kiritilishi shart',
      });
    }

    const submission = await AssignmentSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Topshiriq yuborilishi topilmadi',
      });
    }

    submission.score = score;
    submission.feedback = feedback || null;
    submission.teacherFeedback = feedback || null;
    submission.status = 'graded';
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    await submission.save();

    res.json({
      success: true,
      message: 'Topshiriq muvaffaqiyatli baholandi',
      data: { submission },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchi topshiriqlarini olish (Teacher)
 * @route   GET /api/assignments/student/:studentId
 * @access  Private (Teacher)
 */
export const getStudentAssignments = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar o\'quvchi topshiriqlarini ko\'ra oladi',
      });
    }

    const { studentId } = req.params;

    const submissions = await AssignmentSubmission.find({ studentId })
      .populate('assignmentId', 'title description type dueDate maxScore')
      .populate('studentId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: { submissions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Topshiriq yuborilmalarini olish (Teacher)
 * @route   GET /api/assignments/:id/submissions
 * @access  Private (Teacher)
 */
export const getAssignmentSubmissions = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yuborilmalarni ko\'ra oladi',
      });
    }

    const submissions = await AssignmentSubmission.find({
      assignmentId: req.params.id,
    })
      .populate('studentId', 'firstName lastName email group')
      .sort({ submittedAt: -1 })
      .lean();

    res.json({
      success: true,
      data: { submissions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

