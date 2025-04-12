const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    // Authentication middleware for socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user._id}`);

        // Join user's personal room
        socket.join(`user_${socket.user._id}`);

        // Join specific cryptocurrency rooms
        socket.on('joinCryptoRoom', (cryptoCurrency) => {
            socket.join(`crypto_${cryptoCurrency}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user._id}`);
        });
    });

    return io;
};

const emitTradeUpdate = (trade) => {
    if (!io) return;

    // Emit to specific user
    io.to(`user_${trade.user}`).emit('tradeUpdate', {
        type: 'personal',
        trade
    });

    // Emit to cryptocurrency room
    io.to(`crypto_${trade.cryptoCurrency}`).emit('tradeUpdate', {
        type: 'crypto',
        trade
    });

    // Emit to all connected clients
    io.emit('tradeUpdate', {
        type: 'global',
        trade
    });
};

module.exports = {
    initializeSocket,
    emitTradeUpdate
}; 