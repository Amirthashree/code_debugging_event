const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getIsMockMode } = require('./config/db');
const { initSocketHandler } = require('./socket/socketHandler');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// ── CORS: allow local dev + Vercel frontend + any custom domain ──────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,        // e.g. https://your-app.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true
}));

// Setup Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Attach io to app context for controllers
app.set('io', io);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Auto-seed default admin user in MongoDB ──────────────────────────────
const seedAdminUser = async () => {
  try {
    if (getIsMockMode()) return;
    const User = require('./models/User');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@devdynasty.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      await User.create({
        username: 'AdminDevDynasty',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        collegeOrOrg: 'Dev Dynasty Core',
        status: 'active'
      });
      console.log(`✅ Default admin created: ${adminEmail}`);
    } else {
      console.log('ℹ️  Admin user already exists in database.');
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};

// Connect DB then seed
const initDB = async () => {
  await connectDB();
  await seedAdminUser();
};

initDB();

// Initialize Socket.io Events
initSocketHandler(io);

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/contest', require('./routes/contestRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CODE DEBUGGING - Dev Dynasty Club',
    timestamp: new Date(),
    mode: getIsMockMode() ? 'in-memory' : 'mongodb'
  });
});

// ── Serve React frontend in production ───────────────────────────────────
// When backend and frontend are deployed together (e.g. single Render service)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CODE DEBUGGING Server running on http://localhost:${PORT}`);
  console.log(`🏆 Dev Dynasty Club - Production Online Debugging Engine`);
  console.log(`=======================================================`);
});
