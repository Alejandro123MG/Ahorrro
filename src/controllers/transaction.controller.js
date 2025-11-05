const Transaction = require('../models/transaction.model');
const SavingGoal = require('../models/savingGoal.model');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('savingGoalId', 'name')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('savingGoalId', 'name');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaccion no encontrada' });
    }

    // Check if user owns the transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date, savingGoalId } = req.body;

    // Validate input
    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: 'Por favor complete todos los campos requeridos' });
    }

    // Validate that only income can be assigned to saving goals
    if (savingGoalId && type !== 'income') {
      return res.status(400).json({ message: 'Solo los ingresos pueden asignarse a metas de ahorro' });
    }

    // If savingGoalId is provided, validate it exists and belongs to user
    if (savingGoalId) {
      const savingGoal = await SavingGoal.findById(savingGoalId);

      if (!savingGoal) {
        return res.status(404).json({ message: 'Meta de ahorro no encontrada' });
      }

      if (savingGoal.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'No autorizado para esta meta de ahorro' });
      }

      // Update the saving goal's current amount
      savingGoal.currentAmount += amount;
      await savingGoal.save();
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      description,
      date,
      savingGoalId: savingGoalId || null
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaccion no encontrada' });
    }

    // Check if user owns the transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { type, amount, savingGoalId } = req.body;

    // Validate that only income can be assigned to saving goals
    if (savingGoalId && (type || transaction.type) !== 'income') {
      return res.status(400).json({ message: 'Solo los ingresos pueden asignarse a metas de ahorro' });
    }

    // Handle saving goal amount adjustments
    const oldSavingGoalId = transaction.savingGoalId?.toString();
    const newSavingGoalId = savingGoalId?.toString();
    const oldAmount = transaction.amount;
    const newAmount = amount !== undefined ? amount : oldAmount;

    // If the saving goal changed or amount changed, update the saving goals
    if (oldSavingGoalId || newSavingGoalId) {
      // Remove from old saving goal
      if (oldSavingGoalId) {
        const oldSavingGoal = await SavingGoal.findById(oldSavingGoalId);
        if (oldSavingGoal) {
          oldSavingGoal.currentAmount -= oldAmount;
          await oldSavingGoal.save();
        }
      }

      // Add to new saving goal
      if (newSavingGoalId) {
        const newSavingGoal = await SavingGoal.findById(newSavingGoalId);

        if (!newSavingGoal) {
          return res.status(404).json({ message: 'Meta de ahorro no encontrada' });
        }

        if (newSavingGoal.userId.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'No autorizado para esta meta de ahorro' });
        }

        newSavingGoal.currentAmount += newAmount;
        await newSavingGoal.save();
      }
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaccion no encontrada' });
    }

    // Check if user owns the transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // If transaction was assigned to a saving goal, subtract the amount
    if (transaction.savingGoalId) {
      const savingGoal = await SavingGoal.findById(transaction.savingGoalId);
      if (savingGoal) {
        savingGoal.currentAmount -= transaction.amount;
        await savingGoal.save();
      }
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: 'Transaccion eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
