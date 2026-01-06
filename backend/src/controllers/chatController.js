import ChatMessage from '../models/ChatMessage.js';
import { chatWithAI } from '../services/aiService.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Chat sessiyasini yaratish
 * @route   POST /api/chat/session
 * @access  Private (Student)
 */
export const createSession = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar chat sessiyasi yaratishi mumkin',
      });
    }

    const { lessonId } = req.body;
    const sessionId = uuidv4();

    // Welcome xabari
    const welcomeMessage = await ChatMessage.create({
      studentId: req.user._id,
      lessonId: lessonId || null,
      role: 'assistant',
      content: `Assalomu alaykum! Men sizning AI o'quv yordamchingizman. 🚛

Sizga xalqaro logistika, dispetcherlik va transport sohasida yordam berishga tayyorman.

**Quyidagi savollarga javob bera olaman:**
- Logistika asoslari va tushunchalari
- Broker, shipper, carrier vazifalari
- Load board bilan ishlash
- Rate confirmation tuzish
- Amaliy vaziyatlar va senariylar

Savolingiz bo'lsa, bemalol yozing!`,
      sessionId,
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        message: welcomeMessage,
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
 * @desc    Xabar yuborish
 * @route   POST /api/chat/message
 * @access  Private (Student)
 */
export const sendMessage = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar xabar yuborishi mumkin',
      });
    }

    const { sessionId, content, lessonId } = req.body;

    if (!sessionId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Session ID va xabar mazmuni kiritilishi shart',
      });
    }

    // User xabarini saqlash
    const userMessage = await ChatMessage.create({
      studentId: req.user._id,
      lessonId: lessonId || null,
      role: 'user',
      content: content.trim(),
      sessionId,
    });

    // Oldingi xabarlarni olish (context uchun)
    const previousMessages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(10)
      .lean();

    // AI formatiga o'tkazish
    const aiMessages = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // AI javob olish
    let aiResponse;
    try {
      const aiResult = await chatWithAI(aiMessages, { lessonId });
      
      aiResponse = await ChatMessage.create({
        studentId: req.user._id,
        lessonId: lessonId || null,
        role: 'assistant',
        content: aiResult.content,
        sessionId,
        aiModel: aiResult.model,
        tokens: aiResult.tokens,
      });
    } catch (error) {
      console.error('AI xatosi:', error);
      
      // AI xatosi bo'lsa, default javob
      aiResponse = await ChatMessage.create({
        studentId: req.user._id,
        lessonId: lessonId || null,
        role: 'assistant',
        content: 'Kechirasiz, hozir javob bera olmayman. Iltimos, keyinroq qayta urinib ko\'ring.',
        sessionId,
      });
    }

    res.json({
      success: true,
      data: {
        userMessage,
        aiResponse,
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
 * @desc    Chat tarixini olish
 * @route   GET /api/chat/history
 * @access  Private
 */
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId, studentId } = req.query;

    let query = {};

    // Teacher boshqa o'quvchilarning chatlarini ko'ra oladi
    if (req.user.role === 'teacher') {
      if (studentId) {
        query.studentId = studentId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'O\'quvchi ID kiritilishi shart',
        });
      }
    } else {
      // Student faqat o'z chatlarini ko'radi
      query.studentId = req.user._id;
    }

    if (sessionId) {
      query.sessionId = sessionId;
    }

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: 1 })
      .populate('studentId', 'firstName lastName email')
      .lean();

    res.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchi chatlarini olish (Teacher uchun)
 * @route   GET /api/chat/students/:studentId
 * @access  Private (Teacher)
 */
export const getStudentChats = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar o\'quvchi chatlarini ko\'ra oladi',
      });
    }

    const { studentId } = req.params;

    // Sessiyalarni guruhlash
    const messages = await ChatMessage.find({ studentId })
      .sort({ createdAt: -1 })
      .lean();

    // Sessiyalar bo'yicha guruhlash
    const sessions = {};
    messages.forEach((msg) => {
      if (!sessions[msg.sessionId]) {
        sessions[msg.sessionId] = {
          sessionId: msg.sessionId,
          messages: [],
          createdAt: msg.createdAt,
          lessonId: msg.lessonId,
        };
      }
      sessions[msg.sessionId].messages.push(msg);
    });

    // Har bir sessiyani yaratilish vaqti bo'yicha tartiblash
    const sessionsArray = Object.values(sessions).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      data: { sessions: sessionsArray },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Chatga izoh qoldirish (Teacher)
 * @route   PUT /api/chat/:messageId/feedback
 * @access  Private (Teacher)
 */
export const addFeedback = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar izoh qoldirishi mumkin',
      });
    }

    const { feedback } = req.body;
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.messageId,
      {
        teacherFeedback: feedback,
        isReviewed: true,
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Xabar topilmadi',
      });
    }

    res.json({
      success: true,
      message: 'Izoh muvaffaqiyatli qo\'shildi',
      data: { message },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

