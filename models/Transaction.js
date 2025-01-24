const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  account: {
    type: String,
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
