import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import { initializeSocket } from './socket.js';

// Routes
import authRoutes from './routes/auth.js';
import cropRoutes from './routes/crop.js';
import analyticsRoutes from './routes/analytics.js';
import dealerRoutes from './routes/dealer.js';
import tipsRoutes from './routes/tips.js';
import weatherRoutes from './routes/weather.js';
import chatRoutes from './routes/chat.js';
import orderRoutes from './routes/order.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Farmers Smart Help NaapTol API',
    version: '1.0.0',
    status: 'running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
