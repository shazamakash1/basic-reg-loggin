import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user-controller.js';
import { protect } from '../middleware/auth-middleware.js';
import {
  validate,
  registerValidationRules,
  loginValidationRules,
} from '../middleware/validator-middleware.js';

const router = express.Router();

// Apply validation middleware before the controller
router.post('/register', registerValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);

// Add the new logout route
router.post('/logout', logoutUser);


// --- Protected Route ---
router.get('/profile', protect, (req, res) => {
  // Because of the `protect` middleware, `req.user` is available here
  res.status(200).json({
    message: "Welcome to your profile!",
    user: req.user
  });
});

export default router;