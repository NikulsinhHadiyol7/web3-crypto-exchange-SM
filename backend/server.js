const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const http = require('http');
const connectDB = require('./config/db');
const { initializeSocket } = require('./services/socketService');
const { rateLimiterConfig, tradeRateLimiterConfig } = require('./services/securityService');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit(rateLimiterConfig));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trades', rateLimit(tradeRateLimiterConfig), require('./routes/tradeRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 