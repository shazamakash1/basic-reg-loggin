import User from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';

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
            generateToken(res, user._id);
            
            res.status(201).json({
                _id: user._id,
                username: user.username,
                name: user.name,
                bio: user.bio,
                avatar: user.avatar,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error.message); // Better logging
        res.status(500).json({ message: 'Server error during registration' });
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
            generateToken(res, user._id);

            res.json({
                _id: user._id,
                username: user.username,
                name: user.name,
                bio: user.bio,
                avatar: user.avatar,
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login Error:', error.message); // Better logging
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // ** THE FIX IS HERE **
            // Correctly handles updates, allowing empty strings.
            user.name = req.body.name !== undefined ? req.body.name : user.name;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                name: updatedUser.name,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch(error) {
        console.error('Update Profile Error:', error.message);
        res.status(500).json({ message: 'Server error during profile update' });
    }
};

// @desc    Update user profile picture
// @route   POST /api/users/profile/avatar
// @access  Private
const updateUserProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "mern_auth_avatars" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(req.file.buffer);
    });

    user.avatar = result.secure_url;
    const updatedUser = await user.save();

    res.json({
      message: 'Avatar updated successfully',
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image.', error });
  }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    updateUserProfilePicture
};
