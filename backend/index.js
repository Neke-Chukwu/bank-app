//packages
import path from 'path';
import { fileURLToPath } from 'url'; // Import the necessary function

//express setup
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//utils
import connectDB from './config/db.js';

//importing routes
import userRoutes from './routes/userRoutes.js';
import transferRoutes from './routes/transferRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';
import cardRoutes from './routes/cardRoutes.js';

dotenv.config();
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'; // Default for development
const port = process.env.PORT || 5000;

connectDB();

const app = express(); // Declare app first!

app.use(cors({
    origin: frontendOrigin,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/transfers', transferRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/card', cardRoutes);


app.listen(port, () => console.log("server running on port:", port));