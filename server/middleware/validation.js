import { body, param, validationResult } from 'express-validator';

// Validation middleware wrapper
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 30 })
    .withMessage('Password must be between 6 and 30 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  validate
];

// User login validation
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

// Project creation validation
export const validateCreateProject = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 36 })
    .withMessage('Project name must be between 1 and 36 characters')
    .escape(),
  
  body('plan')
    .optional()
    .isIn(['FREE', 'PREMIUM', 'ENTERPRISE'])
    .withMessage('Plan must be one of: FREE, PREMIUM, ENTERPRISE'),
  
  validate
];

// Project update validation
export const validateUpdateProject = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 36 })
    .withMessage('Project name must be between 1 and 36 characters')
    .escape(),
  
  body('status')
    .optional()
    .isLength({ min: 1, max: 36 })
    .withMessage('Status must be between 1 and 36 characters')
    .escape(),
  
  body('activePlan')
    .optional()
    .isIn(['FREE', 'PREMIUM', 'ENTERPRISE'])
    .withMessage('Plan must be one of: FREE, PREMIUM, ENTERPRISE'),
  
  body('number')
    .optional()
    .trim()
    .isLength({ max: 15 })
    .withMessage('Number must be 15 characters or less')
    .escape(),
  
  validate
];

// Password validation for protected actions
export const validatePassword = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];
