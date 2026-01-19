import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Dars nomi kiritilishi shart'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Dars tavsifi kiritilishi shart'],
    },
    duration: {
      type: String,
      required: true,
      default: '30 daqiqa',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      default: 'beginner',
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LessonModule',
      required: true,
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    content: {
      type: String,
      default: '',
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

// Order bo'yicha tartiblash
lessonSchema.index({ moduleId: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;

