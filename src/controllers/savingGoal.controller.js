const SavingGoal = require('../models/savingGoal.model');
const Transaction = require('../models/transaction.model');

// @desc    Get all saving goals
// @route   GET /api/saving-goals
// @access  Private
const getSavingGoals = async (req, res) => {
  try {
    const savingGoals = await SavingGoal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(savingGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single saving goal
// @route   GET /api/saving-goals/:id
// @access  Private
const getSavingGoal = async (req, res) => {
  try {
    const savingGoal = await SavingGoal.findById(req.params.id);

    if (!savingGoal) {
      return res.status(404).json({ message: 'Meta de ahorro no encontrada' });
    }

    // Check if user owns the saving goal
    if (savingGoal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    res.json(savingGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create saving goal
// @route   POST /api/saving-goals
// @access  Private
const createSavingGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, targetDate } = req.body;

    // Validate input
    if (!name || !targetAmount) {
      return res.status(400).json({ message: 'Por favor complete todos los campos requeridos' });
    }

    const savingGoal = await SavingGoal.create({
      userId: req.user._id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      targetDate
    });

    res.status(201).json(savingGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update saving goal
// @route   PUT /api/saving-goals/:id
// @access  Private
const updateSavingGoal = async (req, res) => {
  try {
    const savingGoal = await SavingGoal.findById(req.params.id);

    if (!savingGoal) {
      return res.status(404).json({ message: 'Meta de ahorro no encontrada' });
    }

    // Check if user owns the saving goal
    if (savingGoal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const updatedSavingGoal = await SavingGoal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSavingGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete saving goal
// @route   DELETE /api/saving-goals/:id
// @access  Private
const deleteSavingGoal = async (req, res) => {
  try {
    const savingGoal = await SavingGoal.findById(req.params.id);

    if (!savingGoal) {
      return res.status(404).json({ message: 'Meta de ahorro no encontrada' });
    }

    // Check if user owns the saving goal
    if (savingGoal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Remove the savingGoalId reference from all related transactions
    await Transaction.updateMany(
      { savingGoalId: req.params.id },
      { $set: { savingGoalId: null } }
    );

    await SavingGoal.findByIdAndDelete(req.params.id);

    res.json({ message: 'Meta de ahorro eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSavingGoals,
  getSavingGoal,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal
};
