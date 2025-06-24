import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js';
import userRoutes from './routes/user-route.js';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js';

// Load environment variables
dotenv.config({path: '../frontend/.env'});

// Connect to database
connectDB();

const app = express();

// Middleware
// app.use(cors());
app.use(express.json()); // To accept JSON data in the body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//swagger ui

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});


// --- Routes ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);


const PORT = process.env.VITE_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.VITE_ENV} mode on port ${PORT}`);
});