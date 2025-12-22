import express from 'express';
import Dealer from '../models/Dealer.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/dealer/add
// @desc    Add new dealer (Admin only)
// @access  Private (Admin)
router.post('/add', protect, admin, async (req, res) => {
  try {
    const { name, cropType, phone, location } = req.body;

    const dealer = await Dealer.create({
      name,
      cropType,
      phone,
      location
    });

    res.status(201).json(dealer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dealer/list
// @desc    Get all dealers
// @access  Private
router.get('/list', protect, async (req, res) => {
  try {
    const { cropType } = req.query;
    
    let query = {};
    if (cropType) {
      query.cropType = new RegExp(cropType, 'i');
    }

    const dealers = await Dealer.find(query).sort({ createdAt: -1 });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/dealer/:id
// @desc    Update dealer
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);

    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    const { name, cropType, phone, location } = req.body;

    dealer.name = name || dealer.name;
    dealer.cropType = cropType || dealer.cropType;
    dealer.phone = phone || dealer.phone;
    dealer.location = location || dealer.location;

    const updatedDealer = await dealer.save();
    res.json(updatedDealer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/dealer/:id
// @desc    Delete dealer
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);

    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    await Dealer.deleteOne({ _id: req.params.id });
    res.json({ message: 'Dealer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
