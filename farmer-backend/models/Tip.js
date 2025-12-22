import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add tip title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add tip description'],
    trim: true
  },
  category: {
    type: String,
    enum: ['best-practices', 'seasonal', 'government-schemes', 'general'],
    default: 'general'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tip = mongoose.model('Tip', tipSchema);

export default Tip;
