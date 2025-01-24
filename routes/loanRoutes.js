const express = require('express');
const { addLoan } = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const Loan = require('../models/Loan');

router.post('/', protect, addLoan);

// Debug route
router.get('/test-loans', (req, res) => {
  res.json({ message: 'Loan routes are working' });
});

// GET /api/loans
router.get('/', async (req, res) => {
  try {
    // Pastikan user ada
    if (!req.user || !req.user._id) {
      console.error('No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Fetching loans for user:', req.user._id);
    
    // Tambahkan error handling untuk query database
    const loans = await Loan.find({ userId: req.user._id })
      .sort({ date: -1 })
      .lean() // Untuk optimasi performa
      .catch(err => {
        console.error('Database query error:', err);
        throw new Error('Failed to fetch loans from database');
      });
    
    console.log('Found loans:', loans?.length || 0);

    // Jika tidak ada loans, kirim array kosong
    if (!loans) {
      return res.json([]);
    }

    // Format loans sebelum dikirim
    const formattedLoans = loans.map(loan => ({
      _id: loan._id,
      name: loan.name,
      amount: loan.amount,
      type: loan.type,
      date: loan.date,
      status: loan.status || 'unpaid',
      note: loan.note || '',
      wallet_id: loan.wallet_id,
      account: loan.account || '',
      userId: loan.userId
    }));

    res.json(formattedLoans);

  } catch (error) {
    console.error('Error in GET /api/loans:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id
    });

    // Kirim error yang lebih deskriptif
    res.status(500).json({
      message: 'Failed to fetch loans',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/loans
router.post('/', async (req, res) => {
  try {
    const { name, amount, type, date, note, wallet_id, account } = req.body;

    // Validasi input
    if (!name || !amount || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Buat loan baru
    const loan = new Loan({
      userId: req.user._id,
      name,
      amount,
      type: type.toLowerCase(),
      date: date || new Date(),
      status: 'unpaid',
      note: note || '',
      wallet_id,
      account
    });

    const savedLoan = await loan.save();
    console.log('Loan saved:', savedLoan);
    res.status(201).json(savedLoan);

  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({
      message: 'Failed to create loan',
      error: error.message
    });
  }
});

// PUT /api/loans/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedLoan = await Loan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json(updatedLoan);
  } catch (error) {
    console.error('Error updating loan:', error);
    res.status(500).json({
      message: 'Failed to update loan',
      error: error.message
    });
  }
});

// DELETE /api/loans/:id
router.delete('/:id', async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    res.status(500).json({
      message: 'Failed to delete loan',
      error: error.message
    });
  }
});

module.exports = router;
