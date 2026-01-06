import mongoose from 'mongoose';

const studentProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LessonModule',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    timeSpent: {
      type: Number, // daqiqalarda
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Bir o'quvchi bir darsni bir marta saqlash
studentProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

const StudentProgress = mongoose.model('StudentProgress', studentProgressSchema);

export default StudentProgress;

