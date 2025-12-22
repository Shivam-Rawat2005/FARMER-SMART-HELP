import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/chat/messages
// @desc    Get all chat messages
// @access  Private
router.get('/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'name role')
      .sort({ timestamp: 1 })
      .limit(100);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chat/message
// @desc    Save a chat message
// @access  Private
router.post('/message', protect, async (req, res) => {
  try {
    const { message } = req.body;

    const newMessage = await Message.create({
      senderId: req.user._id,
      senderName: req.user.name,
      message
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
