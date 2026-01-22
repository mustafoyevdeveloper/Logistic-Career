import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import { gradeAssignment } from '../services/aiService.js';
import sharp from 'sharp';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

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

    // Quiz (test) uchun avtomatik baholash (Telegram quiz kabi)
    let autoScore = null;
    let correctCount = null;
    let totalQuestions = null;
    if (assignment.type === 'quiz' && Array.isArray(assignment.questions)) {
      totalQuestions = assignment.questions.length;
      const correctMap = new Map();
      assignment.questions.forEach((q, idx) => {
        const qid = q?._id?.toString() || idx.toString();
        if (q && q.correctAnswer !== undefined) {
          correctMap.set(qid, {
            correctAnswer: q.correctAnswer,
            points: q.points || 1,
          });
        }
      });
      autoScore = 0;
      correctCount = 0;
      if (Array.isArray(answers)) {
        for (const ans of answers) {
          const qid = ans?.questionId?.toString();
          const correct = qid ? correctMap.get(qid) : null;
          if (correct && ans?.answer !== undefined && ans.answer === correct.correctAnswer) {
            autoScore += correct.points;
            correctCount += 1;
          }
        }
      }
    }

    // Amaliy / senariy uchun AI baholash (avvalgi xulqni saqlab qolamiz)
    let aiScore = null;
    if (assignment.type !== 'quiz') {
      try {
        aiScore = await gradeAssignment(assignment, answers);
      } catch (error) {
        console.error('AI baholash xatosi:', error);
      }
    }

    if (submission) {
      submission.answers = answers;
      // Quiz uchun darhol yakuniy natija (MongoDBda saqlanadi)
      if (assignment.type === 'quiz' && autoScore !== null) {
        submission.score = autoScore;
        submission.status = 'graded';
        submission.gradedAt = new Date();
        submission.correctCount = correctCount;
        submission.totalQuestions = totalQuestions;
        submission.passed = typeof correctCount === 'number' ? correctCount >= 30 : false;
        if (submission.passed) {
          submission.hasPassed = true;
          if (!submission.certificateIssuedAt) submission.certificateIssuedAt = new Date();
          if (!submission.certificateNumber) {
            submission.certificateNumber = `LC-${submission._id.toString().slice(-6).toUpperCase()}`;
          }
        }
        submission.attemptsUsed = (submission.attemptsUsed || 0) + 1;
      } else {
        submission.status = 'submitted';
      }
      submission.submittedAt = new Date();
      submission.aiScore = aiScore;
      await submission.save();
    } else {
      submission = await AssignmentSubmission.create({
        assignmentId: assignment._id,
        studentId: req.user._id,
        answers,
        status: assignment.type === 'quiz' && autoScore !== null ? 'graded' : 'submitted',
        score: assignment.type === 'quiz' && autoScore !== null ? autoScore : null,
        gradedAt: assignment.type === 'quiz' && autoScore !== null ? new Date() : null,
        submittedAt: new Date(),
        aiScore,
        correctCount: assignment.type === 'quiz' && autoScore !== null ? correctCount : null,
        totalQuestions: assignment.type === 'quiz' && autoScore !== null ? totalQuestions : null,
        passed: assignment.type === 'quiz' && autoScore !== null && typeof correctCount === 'number' ? correctCount >= 30 : false,
        hasPassed: assignment.type === 'quiz' && autoScore !== null && typeof correctCount === 'number' ? correctCount >= 30 : false,
        certificateIssuedAt:
          assignment.type === 'quiz' && autoScore !== null && typeof correctCount === 'number' && correctCount >= 30
            ? new Date()
            : null,
        certificateNumber:
          assignment.type === 'quiz' && autoScore !== null && typeof correctCount === 'number' && correctCount >= 30
            ? `LC-${String(new Date().getFullYear())}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`
            : null,
        attemptsUsed: assignment.type === 'quiz' && autoScore !== null ? 1 : 0,
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
 * @desc    Quiz javobini saqlash (har bir tanlovdan so'ng)
 * @route   POST /api/assignments/:id/answer
 * @access  Private (Student)
 */
export const saveQuizAnswer = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar javob yubora oladi',
      });
    }

    const { questionId, answer } = req.body;
    if (!questionId || answer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'questionId va answer yuborilishi shart',
      });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Topshiriq topilmadi',
      });
    }

    if (assignment.type !== 'quiz') {
      return res.status(400).json({
        success: false,
        message: 'Faqat test (quiz) uchun javob saqlanadi',
      });
    }

    let submission = await AssignmentSubmission.findOne({
      assignmentId: assignment._id,
      studentId: req.user._id,
    });

    if (submission && submission.status === 'graded') {
      return res.status(400).json({
        success: false,
        message: 'Bu test allaqachon yakunlangan',
      });
    }

    // Upsert submission va javob
    if (!submission) {
      submission = await AssignmentSubmission.create({
        assignmentId: assignment._id,
        studentId: req.user._id,
        answers: [{ questionId, answer }],
        status: 'submitted',
        submittedAt: new Date(),
      });
    } else {
      const idx = submission.answers.findIndex(
        (a) => a.questionId?.toString() === questionId.toString()
      );
      if (idx >= 0) {
        submission.answers[idx].answer = answer;
      } else {
        submission.answers.push({ questionId, answer });
      }
      submission.status = 'submitted';
      submission.submittedAt = new Date();
      await submission.save();
    }

    res.json({
      success: true,
      message: 'Javob saqlandi',
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
 * @desc    Testni qayta ishlash uchun reset
 * @route   POST /api/assignments/:id/reset
 * @access  Private (Student)
 */
export const resetQuizSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'quvchilar reset qila oladi',
      });
    }

    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Topshiriq topilmadi' });
    }
    if (assignment.type !== 'quiz') {
      return res.status(400).json({ success: false, message: 'Faqat test (quiz) uchun reset mavjud' });
    }

    const submission = await AssignmentSubmission.findOne({
      assignmentId: assignment._id,
      studentId: req.user._id,
    });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission topilmadi' });
    }

    submission.answers = [];
    submission.status = 'pending';
    submission.score = null;
    submission.aiScore = null;
    submission.feedback = null;
    submission.teacherFeedback = null;
    submission.gradedBy = null;
    submission.gradedAt = null;
    submission.submittedAt = null;
    submission.correctCount = null;
    submission.totalQuestions = null;
    submission.passed = false;
    submission.hasPassed = false;
    // attemptsUsed saqlanadi (necha urinish bo‘lganini hisoblash uchun)

    await submission.save();

    res.json({
      success: true,
      message: 'Test reset qilindi',
      data: { submission },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server xatosi' });
  }
};

/**
 * @desc    Sertifikat PNG (faqat ism-familiya; test natijasi yo'q)
 * @route   GET /api/assignments/:id/certificate.png
 * @access  Private (Student)
 */
export const downloadCertificatePng = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Faqat o\'quvchilar yuklab oladi' });
    }

    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Topshiriq topilmadi' });
    }
    if (assignment.type !== 'quiz') {
      return res.status(400).json({ success: false, message: 'Sertifikat faqat test uchun' });
    }

    const submission = await AssignmentSubmission.findOne({
      assignmentId: assignment._id,
      studentId: req.user._id,
    }).lean();

    if (!submission || !submission.hasPassed) {
      return res.status(403).json({ success: false, message: 'Sertifikat yopiq (30+ shart bajarilmagan)' });
    }

    const fullName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim();
    const certNo = submission.certificateNumber || `LC-${submission._id.toString().slice(-6).toUpperCase()}`;

    const templatePath = await findCertificateTemplate();
    if (!templatePath) {
      return res.status(500).json({
        success: false,
        message: 'Sertifikat shabloni topilmadi (Elegant Certificate Of Competition Certificate.pdf)',
      });
    }

    const templatePdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templatePdfBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    // Font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Name styling & positioning (centered)
    const nameFontSize = Number(process.env.CERT_NAME_FONT_SIZE || 40);
    const nameTextWidth = font.widthOfTextAtSize(fullName, nameFontSize);
    const x = Number(process.env.CERT_NAME_X || (width - nameTextWidth) / 2);
    // PDF coordinate system: (0,0) bottom-left
    const y = Number(process.env.CERT_NAME_Y || height * 0.49);

    page.drawText(fullName, {
      x,
      y,
      size: nameFontSize,
      font,
      color: rgb(0, 0, 0),
    });

    const editedPdfBytes = await pdfDoc.save();

    // PDF -> PNG: try sharp first, fallback to puppeteer+pdfjs for reliability
    const png = await pdfToPng(editedPdfBytes);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certNo}.png"`);
    res.send(png);
  } catch (error) {
    console.error('[certificate] error', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: error.message || 'Server xatosi' });
  }
};

async function findCertificateTemplate() {
  // In monorepo environments, backend may run from repo root or /backend
  const candidates = [
    path.resolve(process.cwd(), 'frontend', 'public', 'Elegant Certificate Of Competition Certificate.pdf'),
    path.resolve(process.cwd(), '..', 'frontend', 'public', 'Elegant Certificate Of Competition Certificate.pdf'),
    path.resolve(process.cwd(), 'public', 'Elegant Certificate Of Competition Certificate.pdf'),
    path.resolve(process.cwd(), 'assets', 'Elegant Certificate Of Competition Certificate.pdf'),
  ];

  for (const p of candidates) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // continue
    }
  }
  return null;
}

async function pdfToPng(pdfBytes) {
  // 1) Try sharp (fast) if PDF input is supported in current build
  const density = Number(process.env.CERT_PDF_DENSITY || 200);
  try {
    return await sharp(pdfBytes, { density }).png().toBuffer();
  } catch (sharpError) {
    console.log('[certificate] sharp failed, using puppeteer fallback:', sharpError.message);
    // ignore and fallback
  }

  // 2) Fallback: puppeteer-core + @sparticuz/chromium
  let chromiumPath;
  try {
    if (process.env.CHROMIUM_PATH) {
      chromiumPath = process.env.CHROMIUM_PATH;
    } else {
      // @sparticuz/chromium executablePath() async funksiya
      chromiumPath = await chromium.executablePath();
    }
  } catch (chromiumError) {
    console.error('[certificate] chromium.executablePath() error:', chromiumError);
    throw new Error(`Chromium topilmadi: ${chromiumError.message}. CHROMIUM_PATH ni sozlang yoki @sparticuz/chromium o'rnatilmagan.`);
  }

  if (!chromiumPath) {
    throw new Error('Chromium executablePath topilmadi (CHROMIUM_PATH ni sozlang yoki @sparticuz/chromium o\'rnatilmagan)');
  }

  console.log('[certificate] Using chromium path:', chromiumPath);

  // chromium.args va chromium.headless property'larini ishlatish
  const browserArgs = chromium.args || [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ];

  const browser = await puppeteer.launch({
    executablePath: chromiumPath,
    headless: chromium.headless !== undefined ? chromium.headless : true,
    args: browserArgs,
    defaultViewport: chromium.defaultViewport || { width: 1280, height: 720 },
  });

  try {
    const page = await browser.newPage();
    const base64 = Buffer.from(pdfBytes).toString('base64');
    const scale = Number(process.env.CERT_PDFJS_SCALE || 2); // higher => sharper

    await page.setContent(
      `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            html, body { margin: 0; padding: 0; background: white; }
            canvas { display: block; }
          </style>
        </head>
        <body>
          <canvas id="c"></canvas>
          <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.js"></script>
          <script>
            (async () => {
              const pdfData = Uint8Array.from(atob("${base64}"), c => c.charCodeAt(0));
              const loadingTask = window['pdfjsLib'].getDocument({ data: pdfData });
              const pdf = await loadingTask.promise;
              const pg = await pdf.getPage(1);
              const viewport = pg.getViewport({ scale: ${scale} });
              const canvas = document.getElementById('c');
              const ctx = canvas.getContext('2d');
              canvas.width = Math.floor(viewport.width);
              canvas.height = Math.floor(viewport.height);
              await pg.render({ canvasContext: ctx, viewport }).promise;
              window.__DONE__ = true;
            })();
          </script>
        </body>
      </html>`,
      { waitUntil: 'load' }
    );

    await page.waitForFunction('window.__DONE__ === true', { timeout: 15000 });
    const canvasHandle = await page.$('#c');
    const box = await canvasHandle.boundingBox();
    await page.setViewport({ width: Math.ceil(box.width), height: Math.ceil(box.height), deviceScaleFactor: 1 });

    // Recompute box after viewport update
    const box2 = await canvasHandle.boundingBox();
    return await page.screenshot({
      type: 'png',
      clip: {
        x: Math.floor(box2.x),
        y: Math.floor(box2.y),
        width: Math.ceil(box2.width),
        height: Math.ceil(box2.height),
      },
    });
  } finally {
    await browser.close();
  }
}

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
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yuborilmalarni ko\'ra oladi',
      });
    }

    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Topshiriq topilmadi',
      });
    }

    const submissions = await AssignmentSubmission.find({
      assignmentId: req.params.id,
    })
      .populate('studentId', 'firstName lastName email group')
      .sort({ submittedAt: -1 })
      .lean();

    // Format submissions with question details
    const formattedSubmissions = submissions.map((submission) => {
      const formattedAnswers = assignment.questions?.map((question, index) => {
        const questionId = question._id?.toString() || index.toString();
        const userAnswer = submission.answers?.find((ans, any) => 
          ans.questionId?.toString() === questionId
        );
        
        const answerText = userAnswer?.answer || '';
        const isCorrect = assignment.type === 'quiz' && question.correctAnswer 
          ? answerText === question.correctAnswer 
          : undefined;

        return {
          questionId,
          answer: answerText,
          isCorrect,
          correctAnswer: question.correctAnswer,
          question: question.question,
          points: question.points || 1
        };
      }) || [];

      // Student ma'lumotlarini formatlash
      const studentName = submission.studentId && typeof submission.studentId === 'object'
        ? `${submission.studentId.firstName || ''} ${submission.studentId.lastName || ''}`.trim() || 'Noma\'lum'
        : 'Noma\'lum';
      
      const studentAvatar = submission.studentId && typeof submission.studentId === 'object'
        ? `${submission.studentId.firstName?.charAt(0) || ''}${submission.studentId.lastName?.charAt(0) || ''}`.toUpperCase()
        : '??';

      return {
        id: submission._id.toString(),
        studentName,
        studentAvatar,
        assignmentTitle: assignment.title || 'Topshiriq topilmadi',
        submittedAt: submission.submittedAt 
          ? new Date(submission.submittedAt).toLocaleString('uz-UZ') 
          : (submission.createdAt ? new Date(submission.createdAt).toLocaleString('uz-UZ') : ''),
        status: submission.status || 'pending',
        aiScore: submission.aiScore || null,
        teacherScore: submission.score || null,
        feedback: submission.teacherFeedback || submission.feedback || null,
        answer: '',
        assignmentId: assignment._id.toString(),
        studentId: submission.studentId?._id?.toString() || submission.studentId?.toString() || null,
        answers: formattedAnswers,
        assignment: {
          ...assignment,
          questions: assignment.questions
        },
        // Test natijalari (quiz uchun)
        correctCount: submission.correctCount || null,
        totalQuestions: submission.totalQuestions || null,
        passed: submission.passed || false,
        hasPassed: submission.hasPassed || false,
        attemptsUsed: submission.attemptsUsed || 0,
      };
    });

    res.json({
      success: true,
      data: { submissions: formattedSubmissions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Barcha yuborilmalarni olish (Teacher)
 * @route   GET /api/assignments/submissions/all
 * @access  Private (Teacher)
 */
export const getAllSubmissions = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin barcha yuborilmalarni ko\'ra oladi',
      });
    }

    const submissions = await AssignmentSubmission.find({})
      .populate('studentId', 'firstName lastName email group')
      .populate('assignmentId', 'title description type dueDate maxScore')
      .sort({ submittedAt: -1, createdAt: -1 })
      .lean();

    // Format submissions for frontend
    const formattedSubmissions = submissions
      .filter((submission) => {
        // Faqat to'liq populate qilinganlar va studentId va assignmentId mavjud bo'lganlar
        return submission.studentId && 
               submission.assignmentId && 
               typeof submission.studentId === 'object' && 
               typeof submission.assignmentId === 'object';
      })
      .map((submission) => {
        // Answers array'ni string'ga o'tkazish
        let answerText = '';
        if (submission.answers && Array.isArray(submission.answers) && submission.answers.length > 0) {
          answerText = submission.answers
            .map((ans) => {
              if (typeof ans.answer === 'string') {
                return ans.answer;
              } else if (typeof ans.answer === 'object') {
                return JSON.stringify(ans.answer);
              }
              return String(ans.answer || '');
            })
            .join('\n');
        }

        return {
          id: submission._id.toString(),
          studentName: `${submission.studentId?.firstName || ''} ${submission.studentId?.lastName || ''}`.trim() || 'Noma\'lum',
          studentAvatar: submission.studentId 
            ? `${submission.studentId.firstName?.charAt(0) || ''}${submission.studentId.lastName?.charAt(0) || ''}`.toUpperCase()
            : '??',
          assignmentTitle: submission.assignmentId?.title || 'Topshiriq topilmadi',
          submittedAt: submission.submittedAt 
            ? new Date(submission.submittedAt).toLocaleString('uz-UZ') 
            : (submission.createdAt ? new Date(submission.createdAt).toLocaleString('uz-UZ') : ''),
          status: submission.status || 'pending',
          aiScore: submission.aiScore || null,
          teacherScore: submission.score || null, // score field ishlatiladi
          feedback: submission.teacherFeedback || submission.feedback || null,
          answer: answerText,
          assignmentId: submission.assignmentId?._id?.toString() || submission.assignmentId?.toString() || null,
          studentId: submission.studentId?._id?.toString() || submission.studentId?.toString() || null,
          // Test natijalari (quiz uchun)
          correctCount: submission.correctCount || null,
          totalQuestions: submission.totalQuestions || null,
          passed: submission.passed || false,
          hasPassed: submission.hasPassed || false,
          attemptsUsed: submission.attemptsUsed || 0,
        };
      });

    res.json({
      success: true,
      data: { submissions: formattedSubmissions },
    });
  } catch (error) {
    console.error('getAllSubmissions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

