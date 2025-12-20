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
// Handle SPA routing: serve index.html for any unknown route. 
// MUST BE AFTER API ROUTES
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
