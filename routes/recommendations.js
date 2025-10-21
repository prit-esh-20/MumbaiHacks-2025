const express = require('express');
const router = express.Router();
const User = require('../models/User');
const InsurancePlan = require('../models/InsurancePlan');
const Recommendation = require('../models/Recommendation');
const jwt = require('jsonwebtoken');

// AI-based recommendation algorithm
const generateRecommendations = async (userProfile) => {
  try {
    // Get all insurance plans
    const plans = await InsurancePlan.find();
    
    // Calculate scores for each plan based on user profile
    const scoredPlans = plans.map(plan => {
      // Base score calculation
      let coverageScore = 0;
      let costScore = 0;
      
      // Family size factor
      const familySize = userProfile.familyDetails.members.length;
      
      // Age factor (older family members need better coverage)
      const avgAge = userProfile.familyDetails.members.reduce((sum, member) => sum + member.age, 0) / familySize;
      
      // Medical history factor
      const hasChronicConditions = userProfile.familyDetails.members.some(member => 
        member.medicalHistory && member.medicalHistory.length > 0
      );
      
      // Location factor (check if network hospitals are in user's location)
      const localHospitals = plan.networkHospitals.filter(hospital => 
        hospital.city === userProfile.familyDetails.location.city ||
        hospital.state === userProfile.familyDetails.location.state
      );
      
      // Calculate coverage score (0-10)
      coverageScore += (plan.coverage.hospitalization / 500000) * 4; // 40% weight
      coverageScore += (localHospitals.length / plan.networkHospitals.length) * 3; // 30% weight
      coverageScore += hasChronicConditions ? (plan.coverage.preExisting < 24 ? 2 : 1) : 1; // 20% weight
      coverageScore += (10 - (plan.coverage.maternity / 12)) * 1; // 10% weight
      
      // Calculate cost score (0-10)
      const expectedPremium = plan.premium * familySize * (1 + (avgAge / 100));
      costScore = Math.max(0, 10 - (expectedPremium / 50000)); // Higher premium = lower score
      
      // Overall score
      const overallScore = (coverageScore * 0.7) + (costScore * 0.3);
      
      // Estimated savings (compared to average plan)
      const averagePremium = 25000; // Average Indian health insurance premium
      const savings = (averagePremium * familySize) - expectedPremium;
      
      return {
        planId: plan._id,
        planName: plan.name,
        provider: plan.provider,
        annualPremium: expectedPremium,
        coverageScore: Math.min(10, Math.max(0, coverageScore)),
        costScore: Math.min(10, Math.max(0, costScore)),
        overallScore: Math.min(10, Math.max(0, overallScore)),
        reason: generateRecommendationReason(plan, userProfile, localHospitals.length > 0, hasChronicConditions),
        savings: Math.max(0, savings)
      };
    });
    
    // Sort by overall score and return top 5
    return scoredPlans
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 5);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};

// Generate recommendation reason
const generateRecommendationReason = (plan, userProfile, hasLocalHospitals, hasChronicConditions) => {
  const reasons = [];
  
  if (hasLocalHospitals) {
    reasons.push(`Has hospitals in ${userProfile.familyDetails.location.city}`);
  }
  
  if (hasChronicConditions && plan.coverage.preExisting < 24) {
    reasons.push(`Covers pre-existing conditions after ${plan.coverage.preExisting} months`);
  }
  
  if (plan.coverage.hospitalization > 500000) {
    reasons.push(`High hospitalization coverage of ₹${plan.coverage.hospitalization.toLocaleString()}`);
  }
  
  if (reasons.length === 0) {
    reasons.push('Well-rounded coverage at competitive pricing');
  }
  
  return reasons.join(', ');
};

// Generate insurance recommendations for a user
router.post('/generate', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medinest_secret');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Use user's family details or provided profile
    const userProfile = req.body.familyProfile || user.familyDetails;
    
    // Generate recommendations using AI algorithm
    const recommendations = await generateRecommendations({
      familyDetails: userProfile
    });
    
    // Save recommendations to database
    const recommendationRecord = new Recommendation({
      userId: user._id,
      familyProfile: userProfile,
      recommendations
    });
    
    await recommendationRecord.save();
    
    res.json({
      message: 'Recommendations generated successfully',
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's recommendation history
router.get('/history', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medinest_secret');
    
    const recommendations = await Recommendation.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific recommendation by ID
router.get('/:id', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medinest_secret');
    
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      userId: decoded.userId
    }).populate('recommendations.planId');
    
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;