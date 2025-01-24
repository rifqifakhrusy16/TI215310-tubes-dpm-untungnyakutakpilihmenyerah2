const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, category, account, accountId, date, type } = req.body;
    const userId = req.user._id;

    console.log('Adding transaction:', {
      title, amount, category, account, accountId, date, type, userId
    });

    // Validasi input
    if (!title || !amount || !account || !accountId || !date || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    const transaction = await Transaction.create({
      userId,
      title: title.trim(),
      amount: parseFloat(amount),
      category: category || 'Uncategorized',
      account,
      accountId,
      date: new Date(date),
      type: type.toLowerCase(),
    });

    // Populate account details dan format response
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('accountId', 'name balance')
      .lean();

    // Format response sesuai kebutuhan frontend
    const formattedTransaction = {
      id: populatedTransaction._id,
      title: populatedTransaction.title,
      amount: populatedTransaction.amount,
      category: populatedTransaction.category,
      account: populatedTransaction.account,
      accountId: populatedTransaction.accountId._id,
      date: populatedTransaction.date,
      type: populatedTransaction.type,
      createdAt: populatedTransaction.createdAt
    };

    console.log('Transaction saved:', formattedTransaction);
    res.status(201).json(formattedTransaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ 
      message: 'Error adding transaction', 
      error: error.message 
    });
  }
}; 