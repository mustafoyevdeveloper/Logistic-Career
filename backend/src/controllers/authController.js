import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc    Ro'yxatdan o'tish (Faqat Teacher/Admin uchun)
 * @route   POST /api/auth/register
 * @access  Public (lekin faqat teacher/admin ro'yxatdan o'tishi mumkin)
 */
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Faqat teacher yoki admin ro'yxatdan o'tishi mumkin
    if (role !== 'teacher' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'O\'quvchilar o\'zi ro\'yxatdan o\'ta olmaydi. Faqat o\'qituvchi yoki admin ro\'yxatdan o\'tishi mumkin.',
      });
    }

    // Email tekshirish
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan',
      });
    }

    // User yaratish
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      progress: undefined,
      currentLevel: undefined,
    });

    // Token yaratish
    const token = generateToken(user._id);

    // Last login yangilash
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
      data: {
        user,
        token,
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
 * @desc    Kirish (Device tracking bilan)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password, role, deviceId } = req.body;

    // Email va password tekshirish
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email va parol kiritilishi shart',
      });
    }

    // User topish (password bilan)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri',
      });
    }

    // User active tekshirish
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Hisobingiz o\'chirilgan',
      });
    }

    // Role tekshirish
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Siz ${role} sifatida kirishga ruxsatingiz yo'q`,
      });
    }

    // Student uchun device tracking
    if (user.role === 'student') {
      if (!deviceId) {
        return res.status(400).json({
          success: false,
          message: 'Device ID kiritilishi shart',
        });
      }

      // Agar boshqa qurilmadan kirishga harakat qilayotgan bo'lsa
      if (user.deviceId && user.deviceId !== deviceId) {
        return res.status(403).json({
          success: false,
          message: 'Bu email boshqa qurilmaga bog\'langan. Faqat bir qurilmadan kirish mumkin.',
        });
      }

      // Device ma'lumotlarini yangilash
      const userAgent = req.headers['user-agent'] || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      user.deviceId = deviceId;
      user.deviceInfo = {
        userAgent,
        platform: userAgent.includes('Windows') ? 'Windows' : 
                  userAgent.includes('Mac') ? 'Mac' : 
                  userAgent.includes('Linux') ? 'Linux' : 'Unknown',
        browser: userAgent.includes('Chrome') ? 'Chrome' :
                 userAgent.includes('Firefox') ? 'Firefox' :
                 userAgent.includes('Safari') ? 'Safari' : 'Unknown',
        ipAddress,
      };
      user.lastDeviceLogin = new Date();
    }

    // Token yaratish
    const token = generateToken(user._id);

    // Last login yangilash
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Muvaffaqiyatli kirdingiz',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          group: user.group,
          progress: user.progress,
          currentLevel: user.currentLevel,
          avatar: user.avatar,
        },
        token,
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
 * @desc    Joriy foydalanuvchi ma'lumotlari
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Profil yangilash
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, group, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (group && user.role === 'student') user.group = group;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profil muvaffaqiyatli yangilandi',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Parol o'zgartirish
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Joriy va yangi parol kiritilishi shart',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Joriy parolni tekshirish
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Joriy parol noto\'g\'ri',
      });
    }

    // Yangi parolni o'rnatish
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Parol muvaffaqiyatli o\'zgartirildi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchi yaratish (Teacher/Admin uchun)
 * @route   POST /api/auth/create-student
 * @access  Private (Teacher/Admin)
 */
export const createStudent = async (req, res) => {
  try {
    // Faqat teacher yoki admin o'quvchi yaratishi mumkin
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchi yaratishi mumkin',
      });
    }

    const { email, firstName, lastName, group, password } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, ism va familiya kiritilishi shart',
      });
    }

    // Email tekshirish
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan',
      });
    }

    // Parol yaratish (agar berilmagan bo'lsa, random parol)
    let studentPassword = password;
    if (!studentPassword) {
      // Random parol yaratish (8 ta belgi)
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      studentPassword = Array.from({ length: 8 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
    }

    // O'quvchi yaratish
    const student = await User.create({
      email,
      password: studentPassword,
      firstName,
      lastName,
      role: 'student',
      group: group || null,
      progress: 0,
      currentLevel: 'Boshlang\'ich',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'O\'quvchi muvaffaqiyatli yaratildi',
      data: {
        student: {
          id: student._id,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          group: student.group,
        },
        password: studentPassword, // Parolni qaytarish (faqat bir marta)
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

