const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true, required: true },
  sideA: {
    documents: [String],
    arguments: [{ text: String, timestamp: Date }]
  },
  sideB: {
    documents: [String],
    arguments: [{ text: String, timestamp: Date }]
  },
  aiDecisions: [{
    decision: String,
    reasoning: String,
    timestamp: Date,
    round: Number
  }],
  status: { type: String, default: 'active' },
  argumentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);