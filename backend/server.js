import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js';
import userRoutes from './routes/user-route.js';

// --- Swagger Imports ---
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js'; // Import the swagger config

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// Use cors middleware to allow requests from your frontend
// app.use(cors({
//     origin: 'http://localhost:3000', // Replace with your frontend's URL in production
//     credentials: true,
// }));

app.use(express.json()); // To accept JSON data in the body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// --- Routes ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);

// --- Swagger UI Setup ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});