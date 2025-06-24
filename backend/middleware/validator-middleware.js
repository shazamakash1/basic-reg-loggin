import { body, validationResult } from 'express-validator';

// Middleware to run validation checks and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

// Validation rules for the user registration endpoint
const registerValidationRules = () => {
  return [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required.')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
    body('password')
      .notEmpty().withMessage('Password is required.')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  ];
};

// Validation rules for the user login endpoint
const loginValidationRules = () => {
    return [
      body('username').trim().notEmpty().withMessage('Username is required.'),
      body('password').notEmpty().withMessage('Password is required.'),
    ];
  };

export {
  validate,
  registerValidationRules,
  loginValidationRules,
};
