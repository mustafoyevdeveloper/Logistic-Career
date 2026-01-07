import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

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
        message: 'Hisobingiz o\'chirilgan. Iltimos, o\'qituvchi bilan bog\'laning.',
      });
    }

    // User suspended tekshirish
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Hisobingiz muzlatilgan. Iltimos, o\'qituvchi bilan bog\'laning.',
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

      // DeviceId format: phoneFingerprint_emailHash_sessionId
      // Bir xil telefondan boshqa brauzerdan kirishni qo'llab-quvvatlash
      const deviceIdParts = deviceId.split('_');
      const phoneFingerprint = deviceIdParts[0] || deviceId; // Telefon fingerprint
      
      // Bir email faqat bir qurilmaga (telefonga) bog'lanishi kerak
      // Lekin bir qurilmada (telefonda) ko'p accountlar bo'lishi mumkin
      // Bir xil telefondan boshqa brauzerdan kirish mumkin (avvalgi brauzer logout bo'ladi)
      
      // Agar user'da deviceId bo'lsa, telefon fingerprint'ni tekshirish
      if (user.deviceId) {
        const existingDeviceIdParts = user.deviceId.split('_');
        const existingPhoneFingerprint = existingDeviceIdParts[0] || user.deviceId;
        
        // Agar telefon boshqa bo'lsa, ruxsat bermaslik
        if (existingPhoneFingerprint !== phoneFingerprint) {
          return res.status(403).json({
            success: false,
            message: 'Bu email boshqa qurilmaga bog\'langan. Faqat bir qurilmadan kirish mumkin.',
          });
        }
        
        // Agar bir xil telefondan boshqa brauzerdan kirsa, avvalgi brauzer logout bo'ladi
        // (DeviceId yangilanadi, bu yangi brauzer session'ini ko'rsatadi)
        console.log('🔄 Bir xil telefondan yangi brauzer: avvalgi brauzer logout bo\'ladi');
      }

      // Device ma'lumotlarini yangilash
      const userAgent = req.headers['user-agent'] || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      user.deviceId = deviceId; // Yangi deviceId (yangi brauzer session bilan)
      user.deviceInfo = {
        userAgent,
        platform: userAgent.includes('Windows') ? 'Windows' : 
                  userAgent.includes('Mac') ? 'Mac' : 
                  userAgent.includes('Linux') ? 'Linux' :
                  userAgent.includes('Android') ? 'Android' :
                  userAgent.includes('iPhone') || userAgent.includes('iPad') ? 'iOS' : 'Unknown',
        browser: userAgent.includes('Chrome') ? 'Chrome' :
                 userAgent.includes('Firefox') ? 'Firefox' :
                 userAgent.includes('Safari') ? 'Safari' :
                 userAgent.includes('Edge') ? 'Edge' : 'Unknown',
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
 * @desc    Logout (Device ma'lumotlarini tozalash)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
      });
    }

    // Student uchun device ma'lumotlarini tozalash
    if (user.role === 'student') {
      user.deviceId = null;
      user.deviceInfo = undefined;
      user.lastDeviceLogin = null;
      await user.save({ validateBeforeSave: false });
    }

    res.json({
      success: true,
      message: 'Muvaffaqiyatli chiqdingiz',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Admin login (Maxsus admin kirish)
 * @route   POST /api/auth/admin-login
 * @access  Public
 */
export const adminLogin = async (req, res) => {
  try {
    // Request body'ni log qilish (debug uchun)
    console.log('📥 Admin login request body:', JSON.stringify(req.body));
    console.log('📥 Admin login request headers:', {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
    });
    
    // Body bo'sh bo'lsa, xatolik
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ Empty request body');
      return res.status(400).json({
        success: false,
        message: 'Request body bo\'sh. Email va parol kiritilishi shart',
        debug: {
          bodyType: typeof req.body,
          bodyValue: req.body,
        },
      });
    }
    
    const { email, password } = req.body;

    // Email va password tekshirish
    if (!email || !password) {
      console.log('❌ Missing email or password:', { 
        email: email || 'undefined',
        password: password ? '***' : 'undefined',
        bodyKeys: Object.keys(req.body || {}),
        bodyType: typeof req.body,
      });
      return res.status(400).json({
        success: false,
        message: 'Email va parol kiritilishi shart',
        debug: {
          receivedEmail: !!email,
          receivedPassword: !!password,
          bodyKeys: Object.keys(req.body || {}),
          bodyType: typeof req.body,
        },
      });
    }

    console.log('🔐 Admin login attempt:', { email: email.toLowerCase() });

    // Admin email va parol tekshirish
    // Variant 1: TeacherAdmin@role.com
    const isAdminEmail1 = email.toLowerCase() === 'teacheradmin@role.com';
    const isAdminPassword1 = password === 'LogisticCareer?role=Teacher$admin';
    
    // Variant 2: Eski admin (backward compatibility)
    const isAdminEmail2 = email.toLowerCase() === 'mustafoyevdevelopment@gmail.com';
    const isAdminPassword2 = password === '12345678!@WEB';

    if ((isAdminEmail1 && isAdminPassword1) || (isAdminEmail2 && isAdminPassword2)) {
      // Admin email'ni aniqlash
      const adminEmail = isAdminEmail1 ? 'TeacherAdmin@role.com' : 'mustafoyevdevelopment@gmail.com';
      // Admin parolni aniqlash (boolean emas, string bo'lishi kerak)
      const adminPassword = isAdminEmail1 
        ? 'LogisticCareer?role=Teacher$admin' 
        : '12345678!@WEB';
      
      // Debug: parol to'g'ri ekanligini tekshirish
      console.log('🔑 Admin password type:', typeof adminPassword, 'length:', adminPassword?.length);
      
      try {
        // Admin user yaratish yoki topish
        let admin = await User.findOne({ 
          email: adminEmail.toLowerCase()
        }).select('+password');
        
        if (!admin) {
          // Yangi admin yaratish
          console.log('📝 Creating new admin user:', adminEmail.toLowerCase());
          try {
            // Parolni hash qilish (pre-save hook validation'dan oldin ishlashi uchun)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            
            admin = new User({
              email: adminEmail.toLowerCase(),
              password: hashedPassword, // Hash qilingan parol
              firstName: 'Admin',
              lastName: 'Teacher',
              role: 'admin',
              isActive: true,
              isSuspended: false,
            });
            await admin.save({ validateBeforeSave: true });
            console.log('✅ Admin user created successfully');
          } catch (createError) {
            // Agar unique constraint xatolik bo'lsa, qayta topish
            if (createError.code === 11000 || createError.message.includes('duplicate')) {
              console.log('⚠️ Admin already exists, fetching...');
              admin = await User.findOne({ 
                email: adminEmail.toLowerCase()
              }).select('+password');
              
              if (!admin) {
                throw new Error('Admin yaratib bo\'lmadi va topilmadi');
              }
              
              // Parol va role'ni yangilash
              // Parolni hash qilish (pre-save hook validation'dan oldin ishlashi uchun)
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(adminPassword, salt);
              
              admin.password = hashedPassword; // Hash qilingan parol
              admin.role = 'admin';
              admin.isActive = true;
              admin.isSuspended = false;
              await admin.save({ validateBeforeSave: true });
              console.log('✅ Admin updated successfully');
            } else {
              throw createError;
            }
          }
        } else {
          // Admin mavjud, parolni tekshirish va yangilash
          console.log('👤 Admin user found, checking password...');
          
          // Parolni tekshirish
          let isPasswordMatch = false;
          try {
            if (admin.password) {
              isPasswordMatch = await admin.matchPassword(adminPassword);
            }
          } catch (matchError) {
            console.log('⚠️ Password match error, updating password...');
            isPasswordMatch = false;
          }
          
          // Agar parol match qilmasa yoki admin role noto'g'ri bo'lsa, yangilash
          if (!isPasswordMatch || admin.role !== 'admin') {
            console.log('🔄 Updating admin password and role...');
            // Parolni hash qilish (pre-save hook validation'dan oldin ishlashi uchun)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            
            admin.password = hashedPassword; // Hash qilingan parol
            admin.role = 'admin';
            admin.isActive = true;
            admin.isSuspended = false;
            await admin.save({ validateBeforeSave: true });
            console.log('✅ Admin updated successfully');
          }
        }

        // Admin'ni qayta olish (password'siz, chunki token yaratish uchun kerak emas)
        admin = await User.findById(admin._id);
        if (!admin) {
          throw new Error('Admin user topilmadi');
        }

        // Token yaratish
        let token;
        try {
          token = generateToken(admin._id);
        } catch (tokenError) {
          console.error('❌ Token yaratish xatosi:', tokenError);
          throw new Error('Token yaratib bo\'lmadi. JWT_SECRET tekshiring.');
        }

        // Last login yangilash
        admin.lastLogin = new Date();
        await admin.save({ validateBeforeSave: false });

        console.log('✅ Admin login successful:', admin.email);
        
        res.json({
          success: true,
          message: 'Muvaffaqiyatli kirdingiz',
          data: {
            user: {
              id: admin._id,
              email: admin.email,
              firstName: admin.firstName,
              lastName: admin.lastName,
              role: admin.role,
            },
            token,
          },
        });
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        throw dbError;
      }
    } else {
      // Oddiy teacher/admin login (database'dan)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Email yoki parol noto\'g\'ri',
        });
      }

      // Faqat teacher yoki admin kirishi mumkin
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Faqat o\'qituvchi yoki admin kirishi mumkin',
        });
      }

      // User active tekshirish
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Hisobingiz o\'chirilgan. Iltimos, admin bilan bog\'laning.',
        });
      }

      // User suspended tekshirish
      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          message: 'Hisobingiz muzlatilgan. Iltimos, admin bilan bog\'laning.',
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
          },
          token,
        },
      });
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Database connection xatolik
    if (error.name === 'MongoServerError' || error.message.includes('Mongo')) {
      return res.status(500).json({
        success: false,
        message: 'Database ulanishi xatosi. Iltimos, keyinroq qayta urinib ko\'ring.',
      });
    }
    
    // Validation xatolik
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message || 'Ma\'lumotlar noto\'g\'ri',
      });
    }
    
    // Boshqa xatoliklar
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
      error: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
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

    const { email, firstName, lastName, groupId, password } = req.body;

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
      group: groupId || null,
      progress: 0,
      currentLevel: 'Boshlang\'ich',
      createdBy: req.user._id,
    });

    // Group student count yangilash
    if (groupId) {
      const Group = (await import('../models/Group.js')).default;
      await Group.updateStudentCount(groupId);
    }

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

