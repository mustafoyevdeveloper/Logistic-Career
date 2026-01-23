import User from '../models/User.js';
import Group from '../models/Group.js';
import multer from 'multer';
import { uploadToR2, deleteFromR2 } from '../services/r2Service.js';

// Sertifikat yuklash uchun Multer konfiguratsiyasi (memory storage, 5MB, ruxsat etilgan turlar)
const certificateStorage = multer.memoryStorage();
export const certificateUpload = multer({
  storage: certificateStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Faqat PDF, PNG, JPG, JPEG va WEBP fayllar qabul qilinadi'), false);
    }
  },
}).single('certificate');

/**
 * @desc    O'quvchini o'chirish (hard delete - bazadan to'liq o'chirish)
 * @route   DELETE /api/students/:id
 * @access  Private (Teacher/Admin)
 */
export const deleteStudent = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchini o\'chirishi mumkin',
      });
    }

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    // Agar sertifikati bo'lsa, R2'dan o'chirishga harakat qilish
    if (student.certificateUrl) {
      try {
        await deleteFromR2(student.certificateUrl);
      } catch (error) {
        console.error('Sertifikatni R2\'dan o\'chirishda xatolik:', error);
      }
    }

    // Group student count yangilash (o'chirishdan oldin)
    const groupId = student.group;
    if (groupId) {
      await Group.updateStudentCount(groupId);
    }

    // Hard delete - bazadan to'liq o'chirish
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'O\'quvchi bazadan to\'liq o\'chirildi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchini muzlatish/faollashtirish
 * @route   PUT /api/students/:id/suspend
 * @access  Private (Teacher/Admin)
 */
export const suspendStudent = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchini muzlatishi mumkin',
      });
    }

    const { isSuspended } = req.body;
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    student.isSuspended = isSuspended;
    student.suspendedAt = isSuspended ? new Date() : null;
    student.suspendedBy = isSuspended ? req.user._id : null;
    await student.save();

    res.json({
      success: true,
      message: isSuspended ? 'O\'quvchi muvaffaqiyatli muzlatildi' : 'O\'quvchi muvaffaqiyatli faollashtirildi',
      data: { student },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchini yangilash
 * @route   PUT /api/students/:id
 * @access  Private (Teacher/Admin)
 */
export const updateStudent = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchini yangilashi mumkin',
      });
    }

    const { firstName, lastName, groupId, email, password, deviceName } = req.body;
    const student = await User.findById(req.params.id).select('+password');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    // Ism va familiya yangilash
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    
    // Email yangilash (agar o'zgartirilgan bo'lsa)
    if (email && email !== student.email) {
      // Yangi email tekshirish (boshqa user'da bo'lmasligi kerak)
      const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: student._id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Bu email allaqachon boshqa foydalanuvchi tomonidan ishlatilmoqda',
        });
      }
      student.email = email.toLowerCase();
    }
    
    // Parol yangilash (agar berilgan bo'lsa)
    if (password) {
      student.password = password; // Pre-save hook avtomatik hash qiladi
      student.inputPassword = password; // Parolni hash qilinmasdan saqlash
    }
    
    // Device name yangilash (agar berilgan bo'lsa)
    if (deviceName !== undefined) {
      if (!student.deviceInfo) {
        student.deviceInfo = {};
      }
      student.deviceInfo.deviceName = deviceName || null;
    }
    
    // Guruh yangilash
    if (groupId !== undefined) {
      const oldGroup = student.group;
      student.group = groupId;
      
      // Group student count yangilash
      if (oldGroup) {
        await Group.updateStudentCount(oldGroup);
      }
      if (groupId) {
        await Group.updateStudentCount(groupId);
      }
    }

    await student.save();

    res.json({
      success: true,
      message: 'O\'quvchi muvaffaqiyatli yangilandi',
      data: { student },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchi qurilmasini tozalash (logout qilish)
 * @route   POST /api/students/:id/clear-device
 * @access  Private (Teacher/Admin)
 */
export const clearStudentDevice = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchi qurilmasini tozalashi mumkin',
      });
    }

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    // Device ma'lumotlarini tozalash
    student.deviceId = null;
    student.deviceInfo = undefined;
    student.lastDeviceLogin = null;
    await student.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'O\'quvchi qurilmasi muvaffaqiyatli tozalandi. O\'quvchi logout qilindi.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchi sertifikatini yuklash (Cloudflare R2)
 * @route   POST /api/students/:id/certificate
 * @access  Private (Teacher/Admin)
 */
export const uploadStudentCertificate = async (req, res) => {
  try {
    console.log('[uploadStudentCertificate] Request received:', {
      userId: req.user?._id,
      role: req.user?.role,
      studentId: req.params.id,
      hasFile: !!req.file,
      fileSize: req.file?.size,
      fileMimetype: req.file?.mimetype,
    });

    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchi sertifikatini yuklashi mumkin',
      });
    }

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    if (!req.file) {
      console.error('[uploadStudentCertificate] No file in request');
      return res.status(400).json({
        success: false,
        message: 'Sertifikat fayli yuklanmadi',
      });
    }

    // Eski sertifikat bo'lsa, R2'dan o'chirishga harakat qilamiz
    if (student.certificateUrl) {
      try {
        await deleteFromR2(student.certificateUrl);
        console.log('[uploadStudentCertificate] Old certificate deleted from R2');
      } catch (error) {
        console.error('[uploadStudentCertificate] Error deleting old certificate:', error);
        // Xatolik bo'lsa ham davom etamiz
      }
    }

    // Yangi sertifikatni R2'ga yuklash
    console.log('[uploadStudentCertificate] Uploading to R2...');
    console.log('[uploadStudentCertificate] R2 Config check:', {
      hasAccountId: !!process.env.R2_ACCOUNT_ID,
      hasAccessKeyId: !!process.env.R2_ACCESS_KEY_ID,
      hasSecretAccessKey: !!process.env.R2_SECRET_ACCESS_KEY,
      hasBucket: !!process.env.R2_BUCKET,
      hasPublicBaseUrl: !!process.env.R2_PUBLIC_BASE_URL,
    });
    
    const publicUrl = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'certificates'
    );
    console.log('[uploadStudentCertificate] Upload successful, URL:', publicUrl);

    student.certificateUrl = publicUrl;
    await student.save({ validateBeforeSave: false });
    console.log('[uploadStudentCertificate] Student certificateUrl saved');

    res.json({
      success: true,
      message: 'Sertifikat muvaffaqiyatli yuklandi',
      data: {
        certificateUrl: publicUrl,
      },
    });
  } catch (error) {
    console.error('[uploadStudentCertificate] Error:', error);
    console.error('[uploadStudentCertificate] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Sertifikat yuklashda xatolik',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};


