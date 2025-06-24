import User from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../frontend/.env' });


export const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        const userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ message: 'This username is already taken.' });
        }
        const user = await User.create({ username, email, password, name: username });
        if (user) {
            generateToken(res, user._id);
            res.status(201).json(user);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name !== undefined ? req.body.name : user.name;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
};

export const updateUserProfilePicture = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file provided.' });
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "image", folder: "mern_auth_avatars" }, (error, result) => {
            if (error) reject(error); else resolve(result);
        });
        uploadStream.end(req.file.buffer);
    });

    user.avatar = result.secure_url;
    const updatedUser = await user.save();
    res.json({ message: 'Avatar updated successfully', avatar: updatedUser.avatar });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image.', error });
  }
};
