import express from 'express';
import { updateUserProfile, updateUserProfilePicture } from '../controllers/user-controller.js';
import { protect } from '../middleware/auth-middleware.js';
import upload from '../middleware/upload-middleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

router.route('/profile')
    .get((req, res) => res.json(req.user))
    .put(updateUserProfile);

router.post(
    '/profile/avatar',
    upload.single('avatar'),
    updateUserProfilePicture
);

export default router;
