import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email kiritilishi shart'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Iltimos, to\'g\'ri email kiriting'],
    },
    password: {
      type: String,
      required: [true, 'Parol kiritilishi shart'],
      minlength: [6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'],
      select: false, // Default holatda password qaytarmaslik
    },
    // Parolni hash qilinmasdan saqlash (faqat ko'rsatish uchun)
    inputPassword: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      required: [true, 'Ism kiritilishi shart'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Familiya kiritilishi shart'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: [true, 'Rol tanlanishi shart'],
    },
    group: {
      type: String,
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currentLevel: {
      type: String,
      enum: ['Boshlang\'ich', 'O\'rta', 'Yuqori'],
      default: 'Boshlang\'ich',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    // Device tracking (faqat student uchun)
    deviceId: {
      type: String,
      default: null,
      index: true,
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      browser: String,
      ipAddress: String,
      deviceName: String,
    },
    lastDeviceLogin: {
      type: Date,
      default: null,
    },
    // Session boshlanish vaqti (o'quvchi kirgan vaqt)
    sessionStartTime: {
      type: Date,
      default: null,
    },
    // Pause vaqtlari (offline bo'lgan vaqtlar) - millisekundlarda
    totalPauseTimeMs: {
      type: Number,
      default: 0,
    },
    // Oxirgi pause boshlanish vaqti (offline bo'lgan vaqt)
    lastPauseStartTime: {
      type: Date,
      default: null,
    },
    // O'qituvchi/admin tomonidan yaratilganligi
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Sozlamalar (faqat teacher/admin uchun)
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      newAssignmentNotifications: {
        type: Boolean,
        default: true,
      },
      aiGrading: {
        type: Boolean,
        default: true,
      },
      showAiScores: {
        type: Boolean,
        default: true,
      },
    },
    // Statistikalar (faqat student uchun, bazada saqlanadi)
    stats: {
      openedLessons: {
        type: Number,
        default: 0,
      },
      totalLessons: {
        type: Number,
        default: 7,
      },
      totalScore: {
        type: Number,
        default: 0,
      },
      maxScore: {
        type: Number,
        default: 70,
      },
      progressPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      timeSpentMinutes: {
        type: Number,
        default: 0,
      },
      totalOnlineTimeSeconds: {
        type: Number,
        default: 0,
      },
      aiChats: {
        type: Number,
        default: 0,
      },
      lastStatsUpdate: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Parolni hash qilish (save dan oldin)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Parolni solishtirish metod
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Parolni olib tashlash (JSON response uchun)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;

