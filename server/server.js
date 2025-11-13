const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Import configurations
const connectDB = require('./config/database');
require('./config/cloudinary');

// Import routes
const authRoutes = require('./routes/auth');
const { router: caseRoutes, attachIO } = require('./routes/cases');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
connectDB();



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', attachIO(io), caseRoutes);

// Socket.IO
io.on('connection', (socket) => {
  socket.on('joinCase', (caseId) => {
    socket.join(caseId);
  });
});

const PORT = 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));