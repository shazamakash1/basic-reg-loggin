import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // We now use email as the primary unique identifier for local auth
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple documents to have a null value for email
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        // Password is not required for social logins
    },
    // Keep username as an editable field
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    // Social Login IDs
    googleId: { type: String },
    githubId: { type: String },

    // Profile info
    name: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
    avatar: {
        type: String,
        default: 'https://i.pravatar.cc/150'
    }
}, {
    timestamps: true,
});

// Hash password only if it's provided and modified
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;