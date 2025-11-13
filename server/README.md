# AI Judge System - MERN Stack

A comprehensive mock trial system where AI acts as a judge to evaluate legal cases presented by two sides.

## Features

### Core Functionality
- **Document Upload**: Support for PDF, Word, and text documents
- **Two-Side Arguments**: Plaintiff (Side A) and Defendant (Side B) can present cases
- **AI Judgment**: Gemini AI provides verdicts with detailed reasoning
- **Real-time Updates**: Socket.IO for live case updates
- **Argument Limits**: Maximum 5 follow-up arguments per side
- **Case Management**: Persistent case storage with MongoDB

### Technical Stack
- **Frontend**: React.js with responsive design
- **Backend**: Node.js with Express
- **Database**: MongoDB for case persistence
- **AI**: Google Gemini 2.5 Flash
- **Real-time**: Socket.IO
- **File Upload**: Multer with document parsing

## Installation

1. **Install Dependencies**
```bash
npm install
cd client && npm install
```

2. **Setup Environment**
- Ensure MongoDB is running locally
- Update `.env` with your Gemini API key

3. **Start Development**
```bash
npm run dev
```

## Usage

1. **Create Case**: Click "Create New Case" to start
2. **Upload Documents**: Both sides upload supporting documents
3. **Submit Arguments**: Present legal arguments (max 5 per side)
4. **Request Judgment**: AI analyzes and provides verdict
5. **Follow-up**: Continue arguments based on AI decision

## Improvements & Productization Ideas

### Technical Enhancements
- **Document OCR**: Extract text from scanned documents
- **Legal Database**: Integration with case law and precedents
- **Multi-language**: Support for international cases
- **Video Evidence**: Support for multimedia evidence
- **Blockchain**: Immutable case records
- **Advanced AI**: Fine-tuned legal models

### Business Features
- **Subscription Tiers**: Free, Pro, Enterprise plans
- **Law School Integration**: Educational licensing
- **Expert Witnesses**: AI-powered expert testimony
- **Settlement Suggestions**: AI-mediated settlements
- **Legal Research**: Integrated case law search
- **Analytics Dashboard**: Case outcome predictions

### Market Opportunities
- **Legal Education**: Law school simulation platform
- **Corporate Training**: Internal dispute resolution
- **Insurance Claims**: Automated claim adjudication
- **Small Claims**: Alternative to traditional courts
- **International Arbitration**: Cross-border dispute resolution
- **Contract Disputes**: Automated contract interpretation

### Revenue Streams
- **SaaS Subscriptions**: Monthly/annual plans
- **Per-Case Pricing**: Pay-per-judgment model
- **Enterprise Licensing**: Custom deployments
- **API Access**: Third-party integrations
- **Training Services**: Implementation consulting
- **White-label Solutions**: Branded versions for law firms

## API Endpoints

- `POST /api/cases` - Create new case
- `POST /api/cases/:id/upload/:side` - Upload documents
- `POST /api/cases/:id/argue/:side` - Submit argument
- `POST /api/cases/:id/judge` - Request AI judgment
- `GET /api/cases/:id` - Get case details

## Architecture Benefits

- **Scalable**: Microservices-ready architecture
- **Real-time**: Live updates during proceedings
- **Secure**: Document encryption and access control
- **Extensible**: Plugin architecture for new features
- **International**: Multi-jurisdiction support ready