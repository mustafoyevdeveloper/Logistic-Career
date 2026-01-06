import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc    Ro'yxatdan o'tish
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, group } = req.body;

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
      group: role === 'student' ? group : null,
      progress: role === 'student' ? 0 : undefined,
      currentLevel: role === 'student' ? 'Boshlang\'ich' : undefined,
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
 * @desc    Kirish
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

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

    // Role tekshirish
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Siz ${role} sifatida kirishga ruxsatingiz yo'q`,
      });
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

