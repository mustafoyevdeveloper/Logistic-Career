import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Xabar mazmuni kiritilishi shart'],
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    aiModel: {
      type: String,
      default: 'gpt-3.5-turbo',
    },
    tokens: {
      type: Number,
      default: 0,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    teacherFeedback: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Session va timestamp bo'yicha indeks
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatMessageSchema.index({ studentId: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;

