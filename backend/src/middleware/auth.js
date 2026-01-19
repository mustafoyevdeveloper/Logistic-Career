import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT token tekshirish middleware
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token ni olish
      token = req.headers.authorization.split(' ')[1];

      // Token ni dekod qilish
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ni topish (password bilan)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Foydalanuvchi topilmadi',
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Foydalanuvchi hisobi o\'chirilgan',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token yaroqsiz yoki muddati o\'tgan',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Autentifikatsiya tokeni topilmadi',
    });
  }
};

// Role tekshirish middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autentifikatsiya talab qilinadi',
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Sizning rol ${req.user.role} bu amalni bajarishga ruxsat yo'q`,
      });
    }
    next();
  };
};

