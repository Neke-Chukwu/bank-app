import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import transferRoutes from './routes/transferRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';
import cardRoutes from './routes/cardRoutes.js';

dotenv.config();
connectDB();

const app = express();
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'https://localhost:5173';
const port = process.env.PORT || 5000;

// ✅ CORS setup
app.use(cors({
  origin: frontendOrigin, // https://localhost:5173
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ✅ Handle preflight requests explicitly
app.options('*', cors({
  origin: frontendOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/transfers', transferRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/card', cardRoutes);

// ✅ Start server
app.listen(port, () => console.log("Server running on port", port));
