const mongoose = require('mongoose');

const insurancePlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverage: {
    hospitalization: {
      type: Number, // in rupees
      required: true
    },
    daycare: {
      type: Number, // in rupees
      required: true
    },
    preExisting: {
      type: Number, // waiting period in months
      required: true
    },
    maternity: {
      type: Number, // waiting period in months
      required: true
    }
  },
  premium: {
    type: Number, // annual premium
    required: true
  },
  features: [{
    name: String,
    description: String
  }],
  networkHospitals: [{
    name: String,
    city: String,
    state: String
  }],
  exclusions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);