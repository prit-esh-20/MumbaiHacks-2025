const express = require('express');
const router = express.Router();
const InsurancePlan = require('../models/InsurancePlan');

// Get all insurance plans
router.get('/', async (req, res) => {
  try {
    const plans = await InsurancePlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get insurance plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await InsurancePlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Insurance plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search insurance plans
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const plans = await InsurancePlan.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { provider: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new insurance plan (for admin use)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      provider,
      description,
      coverage,
      premium,
      features,
      networkHospitals,
      exclusions
    } = req.body;
    
    const plan = new InsurancePlan({
      name,
      provider,
      description,
      coverage,
      premium,
      features,
      networkHospitals,
      exclusions
    });
    
    await plan.save();
    res.status(201).json({
      message: 'Insurance plan added successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;