import User from '../models/User.js';
import Group from '../models/Group.js';

/**
 * @desc    O'quvchini o'chirish (soft delete)
 * @route   DELETE /api/students/:id
 * @access  Private (Teacher/Admin)
 */
export const deleteStudent = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchini o\'chirishi mumkin',
      });
    }

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    // Soft delete - isActive ni false qilish
    student.isActive = false;
    await student.save();

    // Group student count yangilash
    if (student.group) {
      await Group.updateStudentCount(student.group);
    }

    res.json({
      success: true,
      message: 'O\'quvchi muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchini muzlatish/faollashtirish
 * @route   PUT /api/students/:id/suspend
 * @access  Private (Teacher/Admin)
 */
export const suspendStudent = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchini muzlatishi mumkin',
      });
    }

    const { isSuspended } = req.body;
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    student.isSuspended = isSuspended;
    student.suspendedAt = isSuspended ? new Date() : null;
    student.suspendedBy = isSuspended ? req.user._id : null;
    await student.save();

    res.json({
      success: true,
      message: isSuspended ? 'O\'quvchi muvaffaqiyatli muzlatildi' : 'O\'quvchi muvaffaqiyatli faollashtirildi',
      data: { student },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    O'quvchini yangilash
 * @route   PUT /api/students/:id
 * @access  Private (Teacher/Admin)
 */
export const updateStudent = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchini yangilashi mumkin',
      });
    }

    const { firstName, lastName, groupId, email } = req.body;
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (groupId !== undefined) {
      const oldGroup = student.group;
      student.group = groupId;
      
      // Group student count yangilash
      if (oldGroup) {
        await Group.updateStudentCount(oldGroup);
      }
      if (groupId) {
        await Group.updateStudentCount(groupId);
      }
    }

    await student.save();

    res.json({
      success: true,
      message: 'O\'quvchi muvaffaqiyatli yangilandi',
      data: { student },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

