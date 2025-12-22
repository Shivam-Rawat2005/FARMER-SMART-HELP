import express from 'express';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/income
// @desc    Get income analytics (from orders only)
// @access  Private
router.get('/income', protect, async (req, res) => {
  try {
    const { period } = req.query; // 'monthly' or 'yearly'
    
    let crops;
    let orders;
    
    if (req.user.role === 'farmer') {
      crops = await Crop.find({ farmerId: req.user._id });
      orders = await Order.find({ farmerId: req.user._id, status: 'paid' });
    } else {
      crops = await Crop.find().populate('farmerId', 'name email');
      orders = await Order.find({ status: 'paid' });
    }

    // Calculate order income (sales only - not crop listings)
    const orderIncome = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Total income = only from actual sales
    const totalIncome = orderIncome;

    // Group by month or year
    const groupedData = {};
    
    // Add order income to groups
    orders.forEach(order => {
      const date = new Date(order.createdAt || order.date);
      let key;
      
      if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = date.getFullYear().toString();
      }

      if (!groupedData[key]) {
        groupedData[key] = { period: key, income: 0, count: 0 };
      }
      
      groupedData[key].income += order.totalAmount;
      groupedData[key].count += 1;
    });

    const chartData = Object.values(groupedData).sort((a, b) => 
      a.period.localeCompare(b.period)
    );

    res.json({
      totalIncome,
      totalCrops: crops.length,
      totalOrders: orders.length,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/price-trends
// @desc    Get price trends by crop
// @access  Private
router.get('/price-trends', protect, async (req, res) => {
  try {
    let crops;
    if (req.user.role === 'farmer') {
      crops = await Crop.find({ farmerId: req.user._id }).sort({ date: 1 });
    } else {
      crops = await Crop.find().sort({ date: 1 });
    }

    // Group by crop name
    const cropTrends = {};
    
    crops.forEach(crop => {
      if (!cropTrends[crop.cropName]) {
        cropTrends[crop.cropName] = [];
      }
      
      cropTrends[crop.cropName].push({
        date: crop.date,
        pricePerUnit: crop.pricePerUnit,
        quantity: crop.quantity,
        totalPrice: crop.totalPrice
      });
    });

    res.json(cropTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/crop-summary
// @desc    Get crop-wise summary
// @access  Private
router.get('/crop-summary', protect, async (req, res) => {
  try {
    let match = {};
    if (req.user.role === 'farmer') {
      match = { farmerId: req.user._id };
    }

    const summary = await Crop.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$cropName',
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalPrice' },
          avgPrice: { $avg: '$pricePerUnit' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
