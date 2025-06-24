import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    updateUserProfilePicture
} from '../controllers/user-controller.js';
import { protect } from '../middleware/auth-middleware.js';
import upload from '../middleware/upload-middleware.js';
import {
  validate,
  registerValidationRules,
  loginValidationRules,
} from '../middleware/validator-middleware.js';

const router = express.Router();

// Public routes with input validation
router.post('/register', registerValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);

// Private routes (require authentication via 'protect' middleware)
router.post('/logout', logoutUser);

router.route('/profile')
    .get(protect, (req, res) => res.json(req.user)) // GET current user's profile
    .put(protect, updateUserProfile); // UPDATE current user's profile info

router.post(
    '/profile/avatar',
    protect,
    upload.single('avatar'), // 'avatar' is the field name for the file
    updateUserProfilePicture
);

export default router;