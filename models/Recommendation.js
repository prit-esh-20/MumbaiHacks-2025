const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  familyProfile: {
    members: [{
      name: String,
      age: Number,
      relationship: String,
      medicalHistory: [String]
    }],
    location: {
      city: String,
      state: String,
      pincode: String
    },
    preferredHospitals: [String]
  },
  recommendations: [{
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsurancePlan'
    },
    planName: String,
    provider: String,
    annualPremium: Number,
    coverageScore: Number, // 1-10 rating
    costScore: Number, // 1-10 rating
    overallScore: Number, // 1-10 rating
    reason: String, // Why this plan was recommended
    savings: Number // Estimated annual savings
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);