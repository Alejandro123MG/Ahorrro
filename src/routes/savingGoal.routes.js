const express = require('express');
const router = express.Router();
const {
  getSavingGoals,
  getSavingGoal,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal
} = require('../controllers/savingGoal.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getSavingGoals)
  .post(createSavingGoal);

router.route('/:id')
  .get(getSavingGoal)
  .put(updateSavingGoal)
  .delete(deleteSavingGoal);

module.exports = router;
