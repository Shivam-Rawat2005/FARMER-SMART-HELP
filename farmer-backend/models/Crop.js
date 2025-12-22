import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: [true, 'Please add crop name'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: 0
  },
  quantityAvailable: {
    type: Number
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton'],
    required: [true, 'Please add unit'],
    default: 'kg'
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Please add price per unit'],
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Calculate total price and initialize quantityAvailable before saving
cropSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.pricePerUnit;
  // Initialize quantityAvailable if not set (undefined or null)
  if (this.quantityAvailable === undefined || this.quantityAvailable === null) {
    this.quantityAvailable = this.quantity;
  }
  next();
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
