const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth, generateToken, sessions, bcrypt } = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [users] = await db.execute(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create session
        const token = generateToken();
        sessions.set(token, { id: user.id, username: user.username });

        res.json({
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin Logout
router.post('/logout', requireAuth, (req, res) => {
    const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
    sessions.delete(sessionToken);
    res.json({ message: 'Logged out successfully' });
});

// Image upload endpoint
const upload = require('../middleware/upload');
router.post('/upload-image', requireAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the URL path to the uploaded image
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ url: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Get all questions (paginated)
router.get('/questions', requireAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, exam, subject, chapter, difficulty } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM questions WHERE 1=1';
        const params = [];

        if (exam) {
            query += ' AND exam = ?';
            params.push(exam);
        }
        if (subject) {
            query += ' AND subject = ?';
            params.push(subject);
        }
        if (chapter) {
            query += ' AND chapter = ?';
            params.push(chapter);
        }
        if (difficulty) {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }

        // Get total count
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await db.execute(countQuery, params);
        const total = countResult[0].total;

        // Get paginated results
        query += ` ORDER BY id DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
        const [rows] = await db.execute(query, params);

        res.json({
            questions: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create new question
router.post('/questions', requireAuth, async (req, res) => {
    try {
        const {
            question_text,
            question_image,
            option_a,
            option_a_image,
            option_b,
            option_b_image,
            option_c,
            option_c_image,
            option_d,
            option_d_image,
            correct_option,
            explanation,
            explanation_image,
            difficulty,
            exam,
            board,
            class: classNum,
            subject,
            chapter
        } = req.body;

        const [result] = await db.execute(
            `INSERT INTO questions 
            (question_text, question_image, option_a, option_a_image, option_b, option_b_image, 
             option_c, option_c_image, option_d, option_d_image, correct_option, 
             explanation, explanation_image, difficulty, exam, board, class, subject, chapter) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [question_text, question_image || null, option_a, option_a_image || null,
                option_b, option_b_image || null, option_c, option_c_image || null,
                option_d, option_d_image || null, correct_option, explanation,
                explanation_image || null, difficulty, exam, board, classNum, subject, chapter]
        );

        res.status(201).json({
            message: 'Question created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update question
router.put('/questions/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            question_text,
            question_image,
            option_a,
            option_a_image,
            option_b,
            option_b_image,
            option_c,
            option_c_image,
            option_d,
            option_d_image,
            correct_option,
            explanation,
            explanation_image,
            difficulty,
            exam,
            board,
            class: classNum,
            subject,
            chapter
        } = req.body;

        await db.execute(
            `UPDATE questions SET 
            question_text = ?, question_image = ?, option_a = ?, option_a_image = ?, 
            option_b = ?, option_b_image = ?, option_c = ?, option_c_image = ?, 
            option_d = ?, option_d_image = ?, correct_option = ?, explanation = ?, 
            explanation_image = ?, difficulty = ?, exam = ?, board = ?, 
            class = ?, subject = ?, chapter = ? 
            WHERE id = ?`,
            [question_text, question_image || null, option_a, option_a_image || null,
                option_b, option_b_image || null, option_c, option_c_image || null,
                option_d, option_d_image || null, correct_option, explanation,
                explanation_image || null, difficulty, exam, board, classNum, subject, chapter, id]
        );

        res.json({ message: 'Question updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete question
router.delete('/questions/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM questions WHERE id = ?', [id]);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all categories
router.get('/categories', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM categories ORDER BY type, value');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update category config
router.put('/categories/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { config } = req.body;

        // Validate JSON
        JSON.parse(config);

        await db.execute(
            'UPDATE categories SET config = ? WHERE id = ?',
            [config, id]
        );

        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create new category
router.post('/categories', requireAuth, async (req, res) => {
    try {
        const { type, value, config } = req.body;

        // Validate JSON
        JSON.parse(config);

        const [result] = await db.execute(
            'INSERT INTO categories (type, value, config) VALUES (?, ?, ?)',
            [type, value, config]
        );

        res.status(201).json({
            message: 'Category created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get statistics
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const [totalCount] = await db.execute('SELECT COUNT(*) as total FROM questions');
        const [byExam] = await db.execute(
            'SELECT exam, COUNT(*) as count FROM questions WHERE exam IS NOT NULL GROUP BY exam'
        );
        const [byDifficulty] = await db.execute(
            'SELECT difficulty, COUNT(*) as count FROM questions GROUP BY difficulty'
        );
        const [bySubject] = await db.execute(
            'SELECT subject, COUNT(*) as count FROM questions GROUP BY subject ORDER BY count DESC LIMIT 10'
        );

        res.json({
            total: totalCount[0].total,
            byExam,
            byDifficulty,
            bySubject
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Bulk upload CSV
router.post('/questions/bulk', requireAuth, async (req, res) => {
    try {
        const { questions } = req.body; // Array of question objects

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < questions.length; i++) {
            try {
                const q = questions[i];
                await db.execute(
                    `INSERT INTO questions 
                    (question_text, option_a, option_b, option_c, option_d, correct_option, 
                     explanation, difficulty, exam, board, class, subject, chapter) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
                    q.correct_option, q.explanation, q.difficulty, q.exam, q.board,
                    q.class, q.subject, q.chapter]
                );
                successCount++;
            } catch (err) {
                errorCount++;
                errors.push({ row: i + 1, error: err.message });
            }
        }

        res.json({
            message: 'Bulk upload completed',
            successCount,
            errorCount,
            errors: errors.slice(0, 10) // Return first 10 errors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
