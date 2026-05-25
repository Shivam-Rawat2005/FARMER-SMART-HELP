import { Server } from 'socket.io';
import Message from './models/Message.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? (process.env.FRONTEND_URL || '*') 
        : 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join chat room
    socket.on('join_chat', (userData) => {
      socket.join('main_chat');
      console.log(`${userData.name} joined chat`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        // Save message to database
        const message = await Message.create({
          senderId: data.senderId,
          senderName: data.senderName,
          message: data.message
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'name role');

        // Broadcast to all users in chat
        io.to('main_chat').emit('receive_message', {
          _id: populatedMessage._id,
          senderId: populatedMessage.senderId,
          senderName: populatedMessage.senderName,
          message: populatedMessage.message,
          timestamp: populatedMessage.timestamp
        });
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to('main_chat').emit('user_typing', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
