const Loan = require('../models/Loan');

exports.addLoan = async (req, res) => {
  try {
    const { name, amount, note, date, type, account, accountId } = req.body;
    const userId = req.user._id;

    // Validasi input
    if (!name || !amount || !type || !date) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    // Validasi type sesuai enum
    if (!['get', 'give'].includes(type.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Invalid loan type. Must be either "get" or "give"' 
      });
    }

    const loan = await Loan.create({
      userId,
      name,
      amount,
      note,
      date,
      type: type.toLowerCase(),
      account,
      accountId,
      status: 'active',
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error('Error adding loan:', error);
    res.status(500).json({ 
      message: 'Error adding loan', 
      error: error.message 
    });
  }
};
