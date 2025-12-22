import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Crop from '../models/Crop.js';
import Dealer from '../models/Dealer.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create an order (only registered dealers can buy)
// @access  Private (admin, buyer)
router.post('/', protect, async (req, res) => {
  try {
    const { cropId, quantity, buyerName, buyerEmail, buyerPhone } = req.body;

    if (!cropId || !quantity || !buyerName || !buyerEmail || !buyerPhone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if buyer is a registered dealer
    const dealer = await Dealer.findOne({ phone: buyerPhone });
    if (!dealer) {
      return res.status(403).json({ message: 'Only registered dealers can purchase crops. Please register as a dealer first.' });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    // Initialize quantityAvailable if not set
    if (!crop.quantityAvailable || crop.quantityAvailable === 0) {
      crop.quantityAvailable = crop.quantity;
      await crop.save(); // Save immediately after initialization
    }

    const availableQty = crop.quantityAvailable;
    if (availableQty < quantity) {
      return res.status(400).json({ message: `Not enough quantity available. Available: ${availableQty}, Requested: ${quantity}` });
    }

    const unitPrice = crop.pricePerUnit;
    const totalAmount = unitPrice * quantity;

    const order = await Order.create({
      buyerId: req.user?._id,
      buyerName,
      buyerEmail,
      buyerPhone,
      farmerId: crop.farmerId,
      cropId: crop._id,
      cropName: crop.cropName,
      quantity,
      unitPrice,
      totalAmount,
      status: 'paid'
    });

    // Decrease ONLY available quantity, keep original quantity intact
    crop.quantityAvailable = Math.max(0, availableQty - quantity);
    await crop.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/admin
// @desc    Get all orders (admin)
// @access  Private (Admin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('farmerId', 'name email')
      .populate('buyerId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/farmer
// @desc    Get orders for logged-in farmer
// @access  Private (Farmer)
router.get('/farmer', protect, async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('buyerId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'paid', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
