import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Guruh nomi kiritilishi shart'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    studentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Student count'ni avtomatik yangilash
groupSchema.statics.updateStudentCount = async function (groupId) {
  const User = mongoose.model('User');
  const count = await User.countDocuments({ 
    group: groupId, 
    role: 'student',
    isActive: true 
  });
  await this.findByIdAndUpdate(groupId, { studentCount: count });
};

const Group = mongoose.model('Group', groupSchema);

export default Group;

