import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topshiriq nomi kiritilishi shart'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Topshiriq tavsifi kiritilishi shart'],
    },
    type: {
      type: String,
      enum: ['quiz', 'practical', 'scenario'],
      required: true,
      default: 'quiz',
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      default: null,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LessonModule',
      default: null,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    maxScore: {
      type: Number,
      default: 100,
      min: 0,
    },
    questions: [
      {
        question: String,
        type: {
          type: String,
          enum: ['multiple-choice', 'text', 'scenario'],
        },
        options: [String],
        correctAnswer: mongoose.Schema.Types.Mixed,
        points: Number,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;

