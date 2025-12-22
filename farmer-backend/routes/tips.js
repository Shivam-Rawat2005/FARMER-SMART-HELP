import express from 'express';
import Tip from '../models/Tip.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/tips/add
// @desc    Add new tip (Admin only)
// @access  Private (Admin)
router.post('/add', protect, admin, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const tip = await Tip.create({
      title,
      description,
      category,
      createdBy: req.user._id
    });

    res.status(201).json(tip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tips/list
// @desc    Get all tips
// @access  Private
router.get('/list', protect, async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = {};
    if (category) {
      query.category = category;
    }

    const tips = await Tip.find(query).sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/tips/:id
// @desc    Delete tip
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }

    await Tip.deleteOne({ _id: req.params.id });
    res.json({ message: 'Tip removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
