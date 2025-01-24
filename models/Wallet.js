const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  balance: {
    type: Number,
    required: true
  },
  initialBalance: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  frontendId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Wallet', walletSchema); 