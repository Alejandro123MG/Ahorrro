const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  initialAmount: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Investment', investmentSchema);
