import Group from '../models/Group.js';
import User from '../models/User.js';

/**
 * @desc    Barcha guruhlarni olish
 * @route   GET /api/groups
 * @access  Private (Teacher/Admin)
 */
export const getGroups = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin guruhlarni ko\'ra oladi',
      });
    }

    const groups = await Group.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();

    // Har bir guruh uchun o'quvchilar sonini hisoblash
    const groupsWithCount = await Promise.all(
      groups.map(async (group) => {
        const studentCount = await User.countDocuments({ 
          group: group._id, 
          role: 'student',
          isActive: true 
        });
        return {
          ...group,
          studentCount,
        };
      })
    );

    res.json({
      success: true,
      data: { groups: groupsWithCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Guruh yaratish
 * @route   POST /api/groups
 * @access  Private (Teacher/Admin)
 */
export const createGroup = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin guruh yaratishi mumkin',
      });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Guruh nomi kiritilishi shart',
      });
    }

    // Guruh nomi unique bo'lishi kerak
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan guruh allaqachon mavjud',
      });
    }

    const group = await Group.create({
      name,
      description: description || '',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Guruh muvaffaqiyatli yaratildi',
      data: { group },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Guruhni yangilash
 * @route   PUT /api/groups/:id
 * @access  Private (Teacher/Admin)
 */
export const updateGroup = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin guruhni yangilashi mumkin',
      });
    }

    const { name, description } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Guruh topilmadi',
      });
    }

    if (name) {
      // Unique tekshirish
      const existingGroup = await Group.findOne({ name, _id: { $ne: group._id } });
      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: 'Bu nom bilan guruh allaqachon mavjud',
        });
      }
      group.name = name;
    }
    if (description !== undefined) group.description = description;

    await group.save();

    res.json({
      success: true,
      message: 'Guruh muvaffaqiyatli yangilandi',
      data: { group },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Guruhni o'chirish (hard delete - bazadan to'liq o'chirish)
 * @route   DELETE /api/groups/:id
 * @access  Private (Teacher/Admin)
 */
export const deleteGroup = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchi yoki admin guruhni o\'chirishi mumkin',
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Guruh topilmadi',
      });
    }

    // Guruhda o'quvchilar bor-yo'qligini tekshirish
    const studentsCount = await User.countDocuments({ group: group._id, role: 'student' });
    if (studentsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Guruhda ${studentsCount} ta o'quvchi bor. Avval o'quvchilarni boshqa guruhga ko'chiring.`,
      });
    }

    // Hard delete - bazadan to'liq o'chirish
    await Group.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Guruh bazadan to\'liq o\'chirildi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

