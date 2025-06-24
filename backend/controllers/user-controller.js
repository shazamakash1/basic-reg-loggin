import User from '../models/user-model.js';
import jwt from 'jsonwebtoken';

// --- Helper function to generate token and set cookie ---
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as a secure, http-only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            password,
        });

        if (user) {
            // Generate token and set cookie upon successful registration
            generateToken(res, user._id);
            
            res.status(201).json({
                _id: user._id,
                username: user.username,
                message: 'User registered successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            // Generate token and set cookie
            generateToken(res, user._id);

            res.json({
                _id: user._id,
                username: user.username,
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
    // Clear the cookie by setting it to an empty value with a past expiration date
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export { registerUser, loginUser, logoutUser };