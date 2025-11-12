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
    required: true,
    enum: ['bitcoin', 'bienes-raices', 'acciones', 'fondos-ahorro']
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
  },
  notes: {
    type: String,
    default: ''
  },

  // Campos específicos para Bitcoin
  bitcoin: {
    quantityBTC: Number,
    purchasePrice: Number,
    currentPrice: Number,
    exchange: String,
    commission: Number
  },

  // Campos específicos para Bienes Raíces
  realEstate: {
    propertyType: String, // casa, terreno, departamento, local comercial
    location: String,
    purchaseValue: Number,
    monthlyRent: Number,
    maintenanceCosts: Number,
    taxesInsurance: Number,
    imageUrl: String
  },

  // Campos específicos para Acciones
  stocks: {
    companyName: String,
    ticker: String,
    quantity: Number,
    purchasePricePerShare: Number,
    currentPricePerShare: Number,
    dividendsReceived: Number,
    brokerCommission: Number,
    platform: String
  },

  // Campos específicos para Fondos de Ahorro
  savingsFund: {
    fundName: String,
    fundType: String, // plazo fijo, ahorro programado, cetes
    annualInterestRate: Number,
    termMonths: Number,
    accumulatedAmount: Number,
    additionalDeposits: Number,
    earlyWithdrawalPenalty: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Investment', investmentSchema);
