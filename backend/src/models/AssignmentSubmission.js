import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        answer: mongoose.Schema.Types.Mixed,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'submitted', 'graded'],
      default: 'pending',
    },
    score: {
      type: Number,
      min: 0,
      default: null,
    },
    aiScore: {
      type: Number,
      min: 0,
      default: null,
    },
    feedback: {
      type: String,
      default: null,
    },
    teacherFeedback: {
      type: String,
      default: null,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    gradedAt: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Bir o'quvchi bir topshiriqni bir marta yuborish
assignmentSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

export default AssignmentSubmission;

