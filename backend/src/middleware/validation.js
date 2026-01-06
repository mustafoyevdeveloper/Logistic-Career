import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation xatosi',
      errors: errors.array(),
    });
  };
};

// Register validation
export const validateRegister = validate([
  body('email').isEmail().withMessage('To\'g\'ri email kiriting'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  body('firstName').notEmpty().withMessage('Ism kiritilishi shart'),
  body('lastName').notEmpty().withMessage('Familiya kiritilishi shart'),
  body('role').isIn(['student', 'teacher']).withMessage('Rol noto\'g\'ri'),
]);

// Login validation
export const validateLogin = validate([
  body('email').isEmail().withMessage('To\'g\'ri email kiriting'),
  body('password').notEmpty().withMessage('Parol kiritilishi shart'),
]);

