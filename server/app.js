const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const startupRoutes = require('./routes/startup');
const aiRoutes = require('./routes/ai');
const reportRoutes = require('./routes/reports');
const chatRoutes = require('./routes/chat');
const investorRoutes = require('./routes/investors');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/output', express.static(path.join(__dirname, 'output')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/', startupRoutes);
app.use('/ai', aiRoutes);
app.use('/download', reportRoutes);
app.use('/chat', chatRoutes);
app.use('/investors', investorRoutes);
app.use('/upload-document', uploadRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'running', service: 'AI Startup Co-Founder' });
});

app.use(errorHandler);

module.exports = app;
