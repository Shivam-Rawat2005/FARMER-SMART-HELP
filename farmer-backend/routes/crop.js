import express from 'express';
import Crop from '../models/Crop.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/crop/add
// @desc    Add new crop
// @access  Private (Farmer)
router.post('/add', protect, async (req, res) => {
  try {
    const { cropName, quantity, unit, pricePerUnit } = req.body;

    const crop = await Crop.create({
      farmerId: req.user._id,
      cropName,
      quantity,
      quantityAvailable: quantity,
      unit,
      pricePerUnit,
      totalPrice: quantity * pricePerUnit
    });

    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/crop/my-crops
// @desc    Get logged in farmer's crops
// @access  Private (Farmer)
router.get('/my-crops', protect, async (req, res) => {
  try {
    let crops = await Crop.find({ farmerId: req.user._id }).sort({ date: -1 });
    // Ensure all crops have quantityAvailable set (only initialize if undefined/null, not if 0)
    crops = crops.map(crop => {
      if (crop.quantityAvailable === undefined || crop.quantityAvailable === null) {
        crop.quantityAvailable = crop.quantity;
      }
      return crop;
    });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/crop/all
// @desc    Get all crops (Admin)
// @access  Private (Admin)
router.get('/all', protect, admin, async (req, res) => {
  try {
    let crops = await Crop.find().populate('farmerId', 'name email').sort({ date: -1 });
    // Ensure all crops have quantityAvailable set (only initialize if undefined/null, not if 0)
    crops = crops.map(crop => {
      if (crop.quantityAvailable === undefined || crop.quantityAvailable === null) {
        crop.quantityAvailable = crop.quantity;
      }
      return crop;
    });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/crop/:id
// @desc    Delete crop
// @access  Private (Farmer)
router.delete('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Check if user owns the crop
    if (crop.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Crop.deleteOne({ _id: req.params.id });
    res.json({ message: 'Crop removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
