import mongoose from 'mongoose';

const lessonModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Modul nomi kiritilishi shart'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Modul tavsifi kiritilishi shart'],
    },
    order: {
      type: Number,
      required: true,
      default: 1,
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

const LessonModule = mongoose.model('LessonModule', lessonModuleSchema);

export default LessonModule;

