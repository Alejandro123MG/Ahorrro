const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0
  },
  targetDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavingGoal', savingGoalSchema);
