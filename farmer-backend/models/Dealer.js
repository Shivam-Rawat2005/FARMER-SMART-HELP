import mongoose from 'mongoose';

const dealerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add dealer name'],
    trim: true
  },
  cropType: {
    type: String,
    required: [true, 'Please add crop type'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add location'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Dealer = mongoose.model('Dealer', dealerSchema);

export default Dealer;
