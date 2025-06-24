import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user-model.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../frontend/.env' });

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

/**
 * A helper function to find or create a user from a social profile.
 * It handles linking social accounts to existing email addresses and
 * generates a unique username if a new user is created.
 */
const findOrCreateUser = async (profile, provider) => {
    const email = profile.emails && profile.emails[0].value;
    const providerIdField = `${provider}Id`; // e.g., 'googleId' or 'githubId'
    const providerId = profile.id;

    // 1. Find user by their social provider ID
    let user = await User.findOne({ [providerIdField]: providerId });
    if (user) {
        return user;
    }

    // 2. If no user with that social ID, try to find by email
    if (email) {
        user = await User.findOne({ email });
        if (user) {
            // User exists, so link the new social account
            user[providerIdField] = providerId;
            // Update avatar only if they are using the default one
            if (user.avatar === 'https://i.pravatar.cc/150') {
               user.avatar = profile.photos[0].value;
            }
            await user.save();
            return user;
        }
    }

    // 3. If no user found, create a new one
    // Generate a unique username to satisfy the schema requirement
    const baseUsername = email ? email.split('@')[0] : (profile.username || profile.displayName.replace(/\s+/g, '')).toLowerCase();
    let username = baseUsername;
    let userExists = await User.findOne({ username });
    let counter = 1;
    // Keep adding a number until the username is unique
    while (userExists) {
        username = `${baseUsername}${counter}`;
        userExists = await User.findOne({ username });
        counter++;
    }

    // Create the new user
    const newUser = await User.create({
        [providerIdField]: providerId,
        username, // The newly generated unique username
        email,
        name: profile.displayName || profile.username,
        avatar: profile.photos[0].value,
    });

    return newUser;
};

// --- Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateUser(profile, 'google');
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));


// --- GitHub Strategy ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ['user:email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateUser(profile, 'github');
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));
