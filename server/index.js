const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const path = require('path');

dotenv.config();

const app = express();
// If PORT is a high number, it's likely meant for the DB, so we use 5000 for the web server to keep the proxy working.
const serverPort = (process.env.PORT && process.env.PORT < 10000) ? process.env.PORT : 5000;
const PORT = serverPort;

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Serve static files from the React client build
app.use(express.static(path.join(__dirname, '../client/dist')));



// Get questions with filters (String-based matching)
app.get('/api/questions', async (req, res) => {
  try {
    const { exam, standard, subject, chapter, difficulty, limit } = req.query;

    let query = 'SELECT * FROM questions WHERE 1=1';
    const params = [];

    if (exam) {
      query += ' AND exam = ?';
      params.push(exam);
    }
    if (standard) {
      query += ' AND class = ?';
      params.push(standard);
    }
    if (subject) {
      query += ' AND subject = ?';
      params.push(subject);
    }
    if (chapter && chapter !== 'All Chapters') {
      query += ' AND chapter = ?';
      params.push(chapter);
    }
    if (difficulty && difficulty !== 'Mixed') {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    const limitVal = parseInt(limit) || 20;
    query += ` ORDER BY RAND() LIMIT ${limitVal}`;

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Configuration (Subjects & Chapters) for a specific Exam or Class
app.get('/api/config', async (req, res) => {
  try {
    const { type, value } = req.query;
    // value would be 'JEE', 'NEET', '10', etc.
    const [rows] = await db.execute('SELECT * FROM categories WHERE type = ? AND value = ?', [type, value]);
    res.json(rows);
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      code: error.code
    });
  }
});

// ===== DETAILED ERROR REPORTING MIDDLEWARE =====
// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2).substring(0, 500));
  }
  next();
});

// Global error handler - MUST be after all routes
app.use((err, req, res, next) => {
  console.error('\n❌ ERROR OCCURRED:');
  console.error('Path:', req.method, req.path);
  console.error('Error Message:', err.message);
  console.error('Stack Trace:', err.stack);

  // Multer-specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File too large',
      error: 'Maximum file size is 5MB',
      details: err.message
    });
  }

  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      message: 'Invalid file type',
      error: err.message,
      details: 'Only JPEG, PNG, and GIF files are allowed'
    });
  }

  // Database errors
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({
      message: 'Database Error',
      error: err.message,
      code: err.code,
      sqlMessage: err.sqlMessage,
      details: 'Check server console for full error details'
    });
  }

  // Generic error response with full details
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: err.toString(),
    stack: err.stack,
    details: 'Check server console for full error details'
  });
});

// Handle SPA routing: serve index.html for any unknown route. 
// MUST BE AFTER API ROUTES
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
