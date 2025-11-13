# AI Judge System 🏛️⚖️

An AI-powered legal judgment platform that allows users to present cases, submit arguments, upload evidence, and receive AI-generated legal decisions. Built with React, Node.js, and Socket.IO for real-time collaboration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **User Authentication**: Secure registration and login system
- **Case Management**: Create and manage multiple legal cases
- **Two-Party System**: Plaintiff (Side A) vs Defendant (Side B)
- **Document Upload**: Support for PDF, DOC, DOCX, and TXT files
- **Real-time Arguments**: Submit up to 5 arguments per side
- **AI Judge**: Request AI-powered legal judgments based on evidence
- **Real-time Updates**: Socket.IO integration for live case updates
- **Dashboard**: Track all your cases with status indicators
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Axios (HTTP client)
- Socket.IO Client (real-time communication)
- Tailwind CSS (styling)

**Backend:**
- Node.js
- Express.js
- Socket.IO (WebSocket server)
- JWT (authentication)
- Multer (file uploads)
- MongoDB/Database (assumed - not visible in frontend code)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-judge-system
```

### 2. Install Backend Dependencies

```bash
# Navigate to the backend directory (assuming it's in the root or server folder)
cd server  # or stay in root if server files are there
npm install
```

**Required Backend Dependencies:**
```bash
npm install express socket.io cors jsonwebtoken bcryptjs multer mongoose dotenv
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

**Key Frontend Dependencies (automatically installed):**
- react
- react-dom
- axios
- socket.io-client
- tailwindcss

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-judge
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-judge

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads

# AI Configuration (if using external AI service)
AI_API_KEY=your-ai-api-key
AI_API_URL=https://api.your-ai-service.com
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5001`. If your backend runs on a different port, update the API URLs in:

- `client/src/App.js`
- `client/src/components/Auth.js`
- `client/src/components/Courtroom.js`
- `client/src/components/SidePanel.js`
- `client/src/components/Dashboard.js`

### Tailwind CSS Configuration

Tailwind is already configured. The `client/tailwind.config.js` should include:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🏃 Running the Application

### Option 1: Run Backend and Frontend Separately

#### Start the Backend Server

```bash
# From the backend/server directory
npm start
# Or for development with auto-restart:
npm run dev  # (requires nodemon)
```

The backend should now be running on `http://localhost:5001`

#### Start the Frontend Development Server

```bash
# From the client directory
cd client
npm start
```

The frontend will open automatically at `http://localhost:3000`

### Option 2: Run with Concurrently (Recommended)

Install concurrently in the root directory:

```bash
npm install concurrently --save-dev
```

Add to root `package.json`:

```json
{
  "scripts": {
    "server": "cd server && npm start",
    "client": "cd client && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}
```

Then run:

```bash
npm run dev
```

## 📁 Project Structure

```
ai-judge-system/
├── client/                    # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.js       # Legacy auth component
│   │   │   ├── AuthPage.js   # Modern auth page
│   │   │   ├── LandingPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Courtroom.js  # Main case interface
│   │   │   ├── SidePanel.js  # Plaintiff/Defendant panel
│   │   │   ├── JudgePanel.js # AI Judge interface
│   │   │   └── Toast.js      # Notification component
│   │   ├── App.js            # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── server/                    # Backend Node.js application
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Auth, upload middleware
│   ├── controllers/          # Business logic
│   ├── uploads/              # Uploaded documents
│   ├── server.js             # Main server file
│   └── package.json
├── .env                      # Environment variables
├── .gitignore
└── README.md
```

## 📖 Usage Guide

### 1. Register/Login

- Visit the landing page
- Click "Get Started" or "Sign In"
- Create an account or log in with existing credentials

### 2. Create a New Case

- From the Dashboard, click "Create New Case"
- A unique Case ID will be generated
- Share this Case ID with other parties if needed

### 3. Upload Documents

- Each side (Plaintiff/Defendant) can upload evidence
- Supported formats: PDF, DOC, DOCX, TXT
- Click "Upload Documents" after selecting files

### 4. Submit Arguments

- Each side can submit up to 5 arguments
- Type your argument in the text area
- Click "Submit Argument"
- Arguments are limited to 5 per case total

### 5. Request AI Judgment

- Once both sides have uploaded documents
- Click "⚖️ Request Judgment" in the Judge Panel
- The AI will analyze evidence and arguments
- A detailed decision with reasoning will appear

### 6. View Case History

- Return to Dashboard to see all your cases
- Cases show status: New, In Progress, or Decided
- Click any case to view or continue

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/register
Body: { name, email, password }

POST /api/auth/login
Body: { email, password }
```

### Cases

```
GET /api/cases/user
Headers: { Authorization: Bearer <token> }

POST /api/cases
Headers: { Authorization: Bearer <token> }

GET /api/cases/:caseId
Headers: { Authorization: Bearer <token> }

POST /api/cases/:caseId/upload/:side
Headers: { Authorization: Bearer <token> }
Body: FormData with 'documents' field

POST /api/cases/:caseId/argue/:side
Headers: { Authorization: Bearer <token> }
Body: { argument }

POST /api/cases/:caseId/judge
Headers: { Authorization: Bearer <token> }
```

### WebSocket Events

```
socket.emit('joinCase', caseId)
socket.on('aiDecision', (decision) => {})
socket.on('newArgument', (data) => {})
socket.on('documentUploaded', (data) => {})
```

## 🐛 Troubleshooting

### Common Issues

**1. Backend won't start**
- Check if MongoDB is running: `mongod` or check MongoDB service
- Verify PORT 5001 is not in use: `lsof -i :5001` (Mac/Linux) or `netstat -ano | findstr :5001` (Windows)
- Check `.env` file exists and is configured correctly

**2. Frontend can't connect to backend**
- Ensure backend is running on port 5001
- Check for CORS errors in browser console
- Verify API URLs in frontend code match backend port

**3. File uploads failing**
- Check `uploads/` directory exists and has write permissions
- Verify file size is under the limit (10MB default)
- Check file type is supported (PDF, DOC, DOCX, TXT)

**4. Socket.IO not connecting**
- Ensure backend Socket.IO server is initialized
- Check for firewall blocking WebSocket connections
- Verify client is connecting to correct URL

**5. JWT Authentication errors**
- Clear browser localStorage and re-login
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in Authorization header

### Development Tips

```bash
# Clear npm cache if having dependency issues
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :5001  # Backend
lsof -i :3000  # Frontend

# View backend logs
# Add console.log statements or use a logger like Winston

# React DevTools
# Install React DevTools browser extension for debugging
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ai-judge |
| JWT_SECRET | Secret key for JWT signing | your-secret-key |
| MAX_FILE_SIZE | Max upload size in bytes | 10485760 |
| UPLOAD_PATH | Directory for uploaded files | ./uploads |
| AI_API_KEY | API key for AI service | your-api-key |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Open an issue on GitHub
- Contact the development team

---

**Built with ⚖️ by the AI Judge Team**
