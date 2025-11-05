const Investment = require('../models/investment.model');

// @desc    Get all investments
// @route   GET /api/investments
// @access  Private
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id }).sort({ startDate: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single investment
// @route   GET /api/investments/:id
// @access  Private
const getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Inversion no encontrada' });
    }

    // Check if user owns the investment
    if (investment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create investment
// @route   POST /api/investments
// @access  Private
const createInvestment = async (req, res) => {
  try {
    const { name, type, initialAmount, currentValue, startDate } = req.body;

    // Validate input
    if (!name || !type || !initialAmount || !currentValue || !startDate) {
      return res.status(400).json({ message: 'Por favor complete todos los campos requeridos' });
    }

    const investment = await Investment.create({
      userId: req.user._id,
      name,
      type,
      initialAmount,
      currentValue,
      startDate
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update investment
// @route   PUT /api/investments/:id
// @access  Private
const updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Inversion no encontrada' });
    }

    // Check if user owns the investment
    if (investment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const updatedInvestment = await Investment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedInvestment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete investment
// @route   DELETE /api/investments/:id
// @access  Private
const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Inversion no encontrada' });
    }

    // Check if user owns the investment
    if (investment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await Investment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Inversion eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment
};
