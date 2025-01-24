const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addWallet,
  getWallets,
  updateWallet,
  deleteWallet
} = require('../controllers/walletController');
const Wallet = require('../models/Wallet');

// Debug endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Wallet routes are working' });
});

// Protected routes
router.use(protect);

// Basic CRUD routes
router.get('/', getWallets);
router.post('/', addWallet);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

// Update wallet balance
router.put('/update-balance/:id', protect, async (req, res) => {
  try {
    const { amount, type } = req.body;
    const walletId = req.params.id;

    console.log('Updating wallet balance:', { walletId, amount, type });

    // Validasi input
    if (!amount || !type) {
      return res.status(400).json({ message: 'Amount and type are required' });
    }

    // Cari wallet
    const wallet = await Wallet.findOne({ 
      _id: walletId,
      userId: req.user._id  // Perbaikan: gunakan userId bukan user
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Update balance
    const currentBalance = parseFloat(wallet.balance);
    const transactionAmount = parseFloat(amount);

    if (type === 'expense') {
      if (currentBalance < transactionAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      wallet.balance = currentBalance - transactionAmount;
    } else if (type === 'income') {
      wallet.balance = currentBalance + transactionAmount;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Simpan perubahan
    const updatedWallet = await wallet.save();

    res.json({
      id: updatedWallet._id,
      frontendId: updatedWallet.frontendId,
      name: updatedWallet.name,
      balance: updatedWallet.balance,
      initialBalance: updatedWallet.initialBalance,
      createdAt: updatedWallet.createdAt
    });

  } catch (error) {
    console.error('Error updating wallet balance:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router; 