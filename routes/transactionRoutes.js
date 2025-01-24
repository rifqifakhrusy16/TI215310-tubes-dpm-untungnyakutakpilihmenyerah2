const express = require('express');
const { addTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Pastikan path sesuai

router.post('/', protect, addTransaction);

// GET /api/transactions
router.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('accountId', 'name')
      .lean();
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
});

// POST /api/transactions
router.post('/transactions', async (req, res) => {
  try {
    console.log('Creating new transaction:', req.body); // Debug log
    
    const transaction = new Transaction({
      title: req.body.title,
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category,
      date: req.body.date,
      account: req.body.account,
      accountId: req.body.accountId
    });

    const savedTransaction = await transaction.save();
    console.log('Transaction saved:', savedTransaction); // Debug log
    
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error in POST /transactions:', error);
    res.status(500).json({
      message: 'Failed to create transaction',
      error: error.message
    });
  }
});

module.exports = router;
