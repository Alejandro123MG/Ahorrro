const express = require('express');
const router = express.Router();
const {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment
} = require('../controllers/investment.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getInvestments)
  .post(createInvestment);

router.route('/:id')
  .get(getInvestment)
  .put(updateInvestment)
  .delete(deleteInvestment);

module.exports = router;
