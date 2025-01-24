const Wallet = require('../models/Wallet');

exports.addWallet = async (req, res) => {
  try {
    const { name, balance, initialBalance, createdAt, id } = req.body;
    const userId = req.user._id;

    // Validasi input
    if (!name || balance === undefined) {
      return res.status(400).json({
        message: 'Name and balance are required'
      });
    }

    // Buat wallet baru sesuai dengan format AddWalletScreen.js
    const wallet = await Wallet.create({
      userId,
      name: name.trim(),
      balance: parseFloat(balance),
      initialBalance: parseFloat(balance),
      createdAt: createdAt || new Date().toISOString(),
      frontendId: id || Date.now().toString()
    });

    res.status(201).json({
      id: wallet._id,
      frontendId: wallet.frontendId,
      name: wallet.name,
      balance: wallet.balance,
      initialBalance: wallet.initialBalance,
      createdAt: wallet.createdAt
    });
  } catch (error) {
    console.error('Error adding wallet:', error);
    res.status(500).json({
      message: 'Error adding wallet',
      error: error.message
    });
  }
};

exports.getWallets = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const wallets = await Wallet.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .exec();
    
    // Format response sesuai dengan format frontend
    const formattedWallets = wallets.map(wallet => ({
      id: wallet._id,
      frontendId: wallet.frontendId,
      name: wallet.name,
      balance: wallet.balance,
      initialBalance: wallet.initialBalance,
      createdAt: wallet.createdAt
    }));
    
    res.status(200).json(formattedWallets);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({
      message: 'Error fetching wallets',
      error: error.message
    });
  }
};

exports.updateWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;
    const userId = req.user._id;

    const wallet = await Wallet.findOneAndUpdate(
      { _id: id, userId },
      { balance: parseFloat(balance) },
      { new: true }
    );

    if (!wallet) {
      return res.status(404).json({
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      id: wallet._id,
      frontendId: wallet.frontendId,
      name: wallet.name,
      balance: wallet.balance,
      initialBalance: wallet.initialBalance,
      createdAt: wallet.createdAt
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({
      message: 'Error updating wallet',
      error: error.message
    });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const wallet = await Wallet.findOneAndDelete({ _id: id, userId });

    if (!wallet) {
      return res.status(404).json({
        message: 'Wallet not found'
      });
    }

    res.status(200).json({ 
      message: 'Wallet deleted successfully',
      id: wallet._id,
      frontendId: wallet.frontendId
    });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    res.status(500).json({
      message: 'Error deleting wallet',
      error: error.message
    });
  }
};