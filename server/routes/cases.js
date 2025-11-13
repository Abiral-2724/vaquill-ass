const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { authenticateToken } = require('../middleware/auth');
const { createCase, uploadDocuments, submitArgument, requestJudgment, getCase, getUserCases } = require('../controllers/caseController');

const router = express.Router();

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-judge-documents',
    resource_type: 'raw'
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Middleware to attach io to req
const attachIO = (io) => (req, res, next) => {
  req.io = io;
  next();
};

router.post('/', authenticateToken, createCase);
router.get('/user', authenticateToken, getUserCases);
router.post('/:caseId/upload/:side', authenticateToken, upload.array('documents'), uploadDocuments);
router.post('/:caseId/argue/:side', authenticateToken, submitArgument);
router.post('/:caseId/judge', authenticateToken, requestJudgment);
router.get('/:caseId', authenticateToken, getCase);

module.exports = { router, attachIO };