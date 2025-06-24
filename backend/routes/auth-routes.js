import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser } from '../controllers/user-controller.js';
import { validate, registerValidationRules, loginValidationRules } from '../middleware/validator-middleware.js';
import { generateToken } from '../controllers/user-controller.js'; // We need this helper

const router = express.Router();

// --- Local Auth Routes ---
router.post('/register', registerValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);
router.post('/logout', logoutUser);

// --- Google Auth Routes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login', session: false }),
    (req, res) => {
        generateToken(res, req.user._id);
        res.redirect('http://localhost:3000/profile');
    }
);

// --- GitHub Auth Routes ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login', session: false }),
    (req, res) => {
        generateToken(res, req.user._id);
        res.redirect('http://localhost:3000/profile');
    }
);

export default router;