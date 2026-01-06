/**
 * Device tracking middleware
 * Student uchun deviceId tekshirish
 */
export const checkDevice = async (req, res, next) => {
  try {
    // Faqat student uchun device tracking
    if (req.user.role !== 'student') {
      return next();
    }

    const deviceId = req.headers['x-device-id'] || req.body.deviceId;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Device ID kiritilishi shart',
      });
    }

    // User deviceId tekshirish
    if (req.user.deviceId && req.user.deviceId !== deviceId) {
      return res.status(403).json({
        success: false,
        message: 'Bu email boshqa qurilmaga bog\'langan. Faqat bir qurilmadan kirish mumkin.',
      });
    }

    // DeviceId ni request'ga qo'shish
    req.deviceId = deviceId;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server xatosi',
    });
  }
};

