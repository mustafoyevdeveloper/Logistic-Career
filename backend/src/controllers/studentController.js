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

    const { firstName, lastName, groupId, email, password, deviceName } = req.body;
    const student = await User.findById(req.params.id).select('+password');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    // Ism va familiya yangilash
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    
    // Email yangilash (agar o'zgartirilgan bo'lsa)
    if (email && email !== student.email) {
      // Yangi email tekshirish (boshqa user'da bo'lmasligi kerak)
      const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: student._id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Bu email allaqachon boshqa foydalanuvchi tomonidan ishlatilmoqda',
        });
      }
      student.email = email.toLowerCase();
    }
    
    // Parol yangilash (agar berilgan bo'lsa)
    if (password) {
      student.password = password; // Pre-save hook avtomatik hash qiladi
    }
    
    // Device name yangilash (agar berilgan bo'lsa)
    if (deviceName !== undefined) {
      if (!student.deviceInfo) {
        student.deviceInfo = {};
      }
      student.deviceInfo.deviceName = deviceName || null;
    }
    
    // Guruh yangilash
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

/**
 * @desc    O'quvchi qurilmasini tozalash (logout qilish)
 * @route   POST /api/students/:id/clear-device
 * @access  Private (Teacher/Admin)
 */
export const clearStudentDevice = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin o\'quvchi qurilmasini tozalashi mumkin',
      });
    }

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi',
      });
    }

    // Device ma'lumotlarini tozalash
    student.deviceId = null;
    student.deviceInfo = undefined;
    student.lastDeviceLogin = null;
    await student.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'O\'quvchi qurilmasi muvaffaqiyatli tozalandi. O\'quvchi logout qilindi.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

