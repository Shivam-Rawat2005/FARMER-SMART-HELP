import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/weather/:city
// @desc    Get weather for a city
// @access  Private
router.get('/:city', protect, async (req, res) => {
  try {
    const { city } = req.params;
    
    // Using weatherapi.com API directly
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'your_weather_api_key_here') {
      // Return mock data if no API key
      return res.json({
        city: city,
        temperature: 25,
        humidity: 65,
        description: 'Clear sky',
        windSpeed: 5,
        pressure: 1013,
        icon: '01d',
        mock: true,
        message: 'Using mock data. Please add WEATHER_API_KEY to .env file'
      });
    }

    // Direct weatherapi.com API call
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    
    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.location.name,
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
      windSpeed: parseFloat((data.current.wind_kph / 3.6).toFixed(2)), // Convert to m/s and limit to 2 decimals
      pressure: data.current.pressure_mb,
      icon: data.current.condition.icon,
      mock: false
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.status(404).json({ message: 'City not found' });
    } else if (error.response && error.response.status === 403) {
      res.status(403).json({ 
        message: 'Invalid weatherapi.com key',
        hint: 'Check your API key at https://www.weatherapi.com'
      });
    } else if (error.response && error.response.status === 429) {
      res.status(429).json({
        message: 'Rate limit exceeded on weatherapi.com',
        hint: 'Wait a few minutes before trying again'
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

export default router;
