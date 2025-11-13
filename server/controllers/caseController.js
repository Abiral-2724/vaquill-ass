const Case = require('../models/Case');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to fetch document content from Cloudinary URL
const fetchDocumentContent = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'text' });
    return response.data;
  } catch (error) {
    return `[Document content unavailable: ${error.message}]`;
  }
};

const createCase = async (req, res) => {
  try {
    const caseId = 'CASE_' + Date.now();
    const newCase = new Case({ caseId });
    await newCase.save();
    res.json({ caseId, message: 'Case created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const { caseId, side } = req.params;
    const case_ = await Case.findOne({ caseId });
    
    if (!case_) return res.status(404).json({ error: 'Case not found' });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const filePaths = req.files.map(file => file.path || file.filename);
    case_[side].documents.push(...filePaths);
    await case_.save();
    
    // Emit socket event for document upload
    req.io.to(caseId).emit('documentUploaded', { side, files: filePaths });
    
    res.json({ message: 'Documents uploaded successfully', files: filePaths });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitArgument = async (req, res) => {
  try {
    console.log('📝 Argument submission started for case:', req.params.caseId, 'side:', req.params.side);
    const { caseId, side } = req.params;
    const { argument } = req.body;
    const case_ = await Case.findOne({ caseId });
    
    if (!case_) return res.status(404).json({ error: 'Case not found' });
    if (case_.argumentCount >= 5) return res.status(400).json({ error: 'Maximum arguments reached' });
    
    case_[side].arguments.push({ text: argument, timestamp: new Date() });
    case_.argumentCount++;
    await case_.save();
    
    console.log('✅ Argument submitted successfully. Total arguments:', case_.argumentCount);
    req.io.to(caseId).emit('newArgument', { side, argument, count: case_.argumentCount });
    res.json({ message: 'Argument submitted', remainingArguments: 5 - case_.argumentCount });
  } catch (error) {
    console.error('❌ Error submitting argument:', error);
    res.status(500).json({ error: error.message });
  }
};

const requestJudgment = async (req, res) => {
  try {
    console.log('⚖️ Requesting judgment for case:', req.params.caseId);
    const { caseId } = req.params;
    const case_ = await Case.findOne({ caseId });
    
    if (!case_) return res.status(404).json({ error: 'Case not found' });
    
    console.log('📄 Found case with', case_.sideA.documents.length, 'Side A docs and', case_.sideB.documents.length, 'Side B docs');
    
    // Simplified approach - analyze arguments and document info without fetching content
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    As an AI Judge, analyze this legal case:
    
    SIDE A (PLAINTIFF):
    Number of Documents: ${case_.sideA.documents.length}
    Arguments: ${case_.sideA.arguments.map(arg => arg.text).join('; ') || 'No arguments submitted'}
    
    SIDE B (DEFENDANT):
    Number of Documents: ${case_.sideB.documents.length}
    Arguments: ${case_.sideB.arguments.map(arg => arg.text).join('; ') || 'No arguments submitted'}
    
    Based on the evidence presented and legal arguments, provide a judicial decision.
    
    Format your response as:
    VERDICT: [Your decision favoring Side A or Side B]
    REASONING: [Your detailed legal analysis]
    `;
    
    console.log('🤖 Sending request to Gemini AI...');
    let result, response;
    let retries = 3;
    
    while (retries > 0) {
      try {
        result = await model.generateContent(prompt);
        response = result.response.text();
        console.log('✅ Received AI response');
        break;
      } catch (error) {
        retries--;
        console.log(`⚠️ Retry attempt ${4 - retries}/3:`, error.message);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
    
    // Parse the response
    const verdictMatch = response.match(/VERDICT:\s*(.+?)(?=\n|REASONING:|$)/i);
    const reasoningMatch = response.match(/REASONING:\s*([\s\S]+)/i);
    
    const aiDecision = {
      decision: verdictMatch ? verdictMatch[1].trim() : response.split('\n')[0],
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : response,
      timestamp: new Date(),
      round: case_.aiDecisions.length + 1
    };
    
    case_.aiDecisions.push(aiDecision);
    await case_.save();
    
    console.log('⚖️ Judgment given:', aiDecision.decision);
    req.io.to(caseId).emit('aiDecision', aiDecision);
    res.json(aiDecision);
  } catch (error) {
    console.error('❌ Judgment error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getCase = async (req, res) => {
  try {
    const case_ = await Case.findOne({ caseId: req.params.caseId });
    if (!case_) return res.status(404).json({ error: 'Case not found' });
    res.json(case_);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 }).limit(50);
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCase, uploadDocuments, submitArgument, requestJudgment, getCase, getUserCases };