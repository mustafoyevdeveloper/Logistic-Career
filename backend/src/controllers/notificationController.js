import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * @desc    Notification'larni olish (Teacher/Admin)
 * @route   GET /api/notifications
 * @access  Private (Teacher/Admin)
 */
export const getNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin notification\'larni ko\'ra oladi',
      });
    }

    const { isRead, limit = 50 } = req.query;

    // Query yaratish
    let query = {
      $or: [
        { teacherId: req.user._id },
        { isGlobal: true },
      ],
    };

    // isRead filter
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    // Notification'larni olish
    const notifications = await Notification.find(query)
      .populate('studentId', 'firstName lastName email group')
      .populate('teacherId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Har bir notification uchun read status tekshirish
    const formattedNotifications = notifications.map((notification) => {
      const isReadByUser = notification.readBy?.some(
        (read) => read.userId.toString() === req.user._id.toString()
      ) || false;

      return {
        ...notification,
        isRead: isReadByUser || notification.isRead,
      };
    });

    // O'qilmagan notification'lar soni
    const unreadCount = await Notification.countDocuments({
      $or: [
        { teacherId: req.user._id },
        { isGlobal: true },
      ],
      readBy: {
        $not: {
          $elemMatch: {
            userId: req.user._id,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        notifications: formattedNotifications,
        unreadCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Notification'ni o'qilgan deb belgilash
 * @route   PUT /api/notifications/:id/read
 * @access  Private (Teacher/Admin)
 */
export const markAsRead = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin notification\'larni o\'qilgan deb belgilashi mumkin',
      });
    }

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification topilmadi',
      });
    }

    // Foydalanuvchi bu notification'ni o'qilgan deb belgilash
    const alreadyRead = notification.readBy?.some(
      (read) => read.userId.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      notification.readBy = notification.readBy || [];
      notification.readBy.push({
        userId: req.user._id,
        readAt: new Date(),
      });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notification o\'qilgan deb belgilandi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

/**
 * @desc    Barcha notification'larni o'qilgan deb belgilash
 * @route   PUT /api/notifications/read-all
 * @access  Private (Teacher/Admin)
 */
export const markAllAsRead = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'qituvchilar yoki admin notification\'larni o\'qilgan deb belgilashi mumkin',
      });
    }

    // Barcha o'qilmagan notification'larni topish
    const notifications = await Notification.find({
      $or: [
        { teacherId: req.user._id },
        { isGlobal: true },
      ],
      readBy: {
        $not: {
          $elemMatch: {
            userId: req.user._id,
          },
        },
      },
    });

    // Har birini o'qilgan deb belgilash
    for (const notification of notifications) {
      notification.readBy = notification.readBy || [];
      notification.readBy.push({
        userId: req.user._id,
        readAt: new Date(),
      });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Barcha notification\'lar o\'qilgan deb belgilandi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

