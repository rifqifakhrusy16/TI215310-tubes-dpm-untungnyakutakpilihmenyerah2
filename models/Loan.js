const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['get', 'give'],
    required: true
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);
