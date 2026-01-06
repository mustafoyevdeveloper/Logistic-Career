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
      enum: ['student', 'teacher'],
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
    lastLogin: {
      type: Date,
      default: null,
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

