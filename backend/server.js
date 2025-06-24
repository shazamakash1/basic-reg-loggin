import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

import connectDB from './db/connect.js';
import authRoutes from './routes/auth-routes.js';
import profileRoutes from './routes/profile-routes.js'; // We'll rename this
import './config/passport.js'; // This ensures passport config is run

import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js';

dotenv.config({path: '../frontend/.env'});
connectDB();

const app = express();

// app.use(express.static('dist'));

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Session and Passport Middleware ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes); // Use new profile routes

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
