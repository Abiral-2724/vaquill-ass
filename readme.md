# AI Judge System 🏛️⚖️

An AI-powered legal judgment platform that allows users to present cases, submit arguments, upload evidence, and receive AI-generated legal decisions. Built with React, Node.js, and Socket.IO for real-time collaboration.
Project video : https://youtu.be/z6hCl3B-JQA

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
- MongoDB/Database 

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

## 🚀 Running backend / frontend

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-judge-system
```

### Backend Configuration

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5001
```

## 🏃 Running the Application


#### Start the Backend Server

```bash
cd backend
npm install
npm run dev  # (requires nodemon)
```

The backend should now be running on `http://localhost:5001`

#### Start the Frontend Development Server

```bash
# From the client directory
cd client
npm install
npm start
```

The frontend will open automatically at `http://localhost:3000`


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
│   └── .env   # Environment variables
│        
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

**Built with ⚖️ by the Abiral jain*
