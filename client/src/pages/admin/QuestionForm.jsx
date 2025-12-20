import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createQuestion, updateQuestion } from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const QuestionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const existingQuestion = location.state?.question;
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        question_text: '',
        question_image: '',
        option_a: '',
        option_a_image: '',
        option_b: '',
        option_b_image: '',
        option_c: '',
        option_c_image: '',
        option_d: '',
        option_d_image: '',
        correct_option: 'A',
        explanation: '',
        explanation_image: '',
        difficulty: 'Medium',
        exam: '',
        board: '',
        class: '',
        subject: '',
        chapter: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Category data for dropdowns
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableChapters, setAvailableChapters] = useState([]);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { getAdminCategories } = await import('../../services/api');
                const data = await getAdminCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (existingQuestion && categories.length > 0) {
            setFormData({
                question_text: existingQuestion.question_text || '',
                question_image: existingQuestion.question_image || '',
                option_a: existingQuestion.option_a || '',
                option_a_image: existingQuestion.option_a_image || '',
                option_b: existingQuestion.option_b || '',
                option_b_image: existingQuestion.option_b_image || '',
                option_c: existingQuestion.option_c || '',
                option_c_image: existingQuestion.option_c_image || '',
                option_d: existingQuestion.option_d || '',
                option_d_image: existingQuestion.option_d_image || '',
                correct_option: existingQuestion.correct_option || 'A',
                explanation: existingQuestion.explanation || '',
                explanation_image: existingQuestion.explanation_image || '',
                difficulty: existingQuestion.difficulty || 'Medium',
                exam: existingQuestion.exam || '',
                board: existingQuestion.board || '',
                class: existingQuestion.class || '',
                subject: existingQuestion.subject || '',
                chapter: existingQuestion.chapter || ''
            });

            // Find and set the category after categories are loaded
            const cat = categories.find(c =>
                (c.type === 'exam' && c.value === existingQuestion.exam) ||
                (c.type === 'class' && c.value === existingQuestion.class)
            );

            if (cat) {
                setSelectedCategory(cat);
                updateSubjectsAndChapters(cat, existingQuestion.subject);
            }
        }
    }, [existingQuestion, categories]);

    // Update subjects when category changes
    const updateSubjectsAndChapters = (category, preselectedSubject = null) => {
        if (!category) return;

        try {
            const config = typeof category.config === 'string' ? JSON.parse(category.config) : category.config;
            const subjects = Object.keys(config);
            setAvailableSubjects(subjects);

            if (preselectedSubject && config[preselectedSubject]) {
                const rawChapters = config[preselectedSubject];
                const chapters = Array.isArray(rawChapters) ? rawChapters : rawChapters.split(',').map(c => c.trim());
                setAvailableChapters(chapters);
            } else if (subjects.length > 0) {
                const firstSubject = subjects[0];
                const rawChapters = config[firstSubject];
                const chapters = Array.isArray(rawChapters) ? rawChapters : rawChapters.split(',').map(c => c.trim());
                setAvailableChapters(chapters);
                setFormData(prev => ({ ...prev, subject: firstSubject, chapter: chapters[0] || '' }));
            }
        } catch (error) {
            console.error('Failed to parse category config:', error);
        }
    };

    const handleCategoryChange = (categoryId) => {
        const cat = categories.find(c => c.id === parseInt(categoryId));
        setSelectedCategory(cat);

        if (cat) {
            if (cat.type === 'exam') {
                setFormData(prev => ({ ...prev, exam: cat.value, class: '' }));
            } else {
                setFormData(prev => ({ ...prev, class: cat.value, exam: '' }));
            }
            updateSubjectsAndChapters(cat);
        }
    };

    const handleSubjectChange = (subject) => {
        setFormData(prev => ({ ...prev, subject }));

        if (selectedCategory) {
            try {
                const config = typeof selectedCategory.config === 'string' ? JSON.parse(selectedCategory.config) : selectedCategory.config;
                const rawChapters = config[subject];
                const chapters = Array.isArray(rawChapters) ? rawChapters : rawChapters.split(',').map(c => c.trim());
                setAvailableChapters(chapters);
                setFormData(prev => ({ ...prev, chapter: chapters[0] || '' }));
            } catch (error) {
                console.error('Failed to get chapters:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await updateQuestion(id, formData);
            } else {
                await createQuestion(formData);
            }
            navigate('/admin/questions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (name, url) => {
        setFormData(prev => ({ ...prev, [name]: url }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/questions')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? 'Edit Question' : 'Add New Question'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Question Text */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Question Text *
                        </label>
                        <textarea
                            name="question_text"
                            value={formData.question_text}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                            placeholder="Enter the question..."
                        />
                        <div className="mt-4">
                            <ImageUpload
                                label="Question Image (Optional)"
                                name="question_image"
                                value={formData.question_image}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {['a', 'b', 'c', 'd'].map((opt) => (
                            <div key={opt} className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Option {opt.toUpperCase()} *
                                </label>
                                <input
                                    type="text"
                                    name={`option_${opt}`}
                                    value={formData[`option_${opt}`]}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                                    placeholder={`Option ${opt.toUpperCase()}`}
                                />
                                <ImageUpload
                                    label={`Option ${opt.toUpperCase()} Image (Optional)`}
                                    name={`option_${opt}_image`}
                                    value={formData[`option_${opt}_image`]}
                                    onChange={handleImageChange}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Correct Answer & Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Correct Answer *
                            </label>
                            <select
                                name="correct_option"
                                value={formData.correct_option}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Difficulty *
                            </label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Explanation
                        </label>
                        <textarea
                            name="explanation"
                            value={formData.explanation}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                            placeholder="Explain the correct answer..."
                        />
                        <div className="mt-4">
                            <ImageUpload
                                label="Explanation Image (Optional)"
                                name="explanation_image"
                                value={formData.explanation_image}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Metadata - Category Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Exam / Class *
                        </label>
                        <select
                            value={selectedCategory?.id || ''}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                        >
                            <option value="">Select Exam or Class</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.type === 'exam' ? `Exam: ${cat.value}` : `Class: ${cat.value}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subject & Chapter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Subject *
                            </label>
                            <select
                                value={formData.subject}
                                onChange={(e) => handleSubjectChange(e.target.value)}
                                required
                                disabled={!selectedCategory}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Subject</option>
                                {availableSubjects.map((subj) => (
                                    <option key={subj} value={subj}>{subj}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Chapter *
                            </label>
                            <select
                                name="chapter"
                                value={formData.chapter}
                                onChange={handleChange}
                                required
                                disabled={!formData.subject}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Chapter</option>
                                {availableChapters.map((chap) => (
                                    <option key={chap} value={chap}>{chap}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="h-5 w-5" />
                            {loading ? 'Saving...' : (isEdit ? 'Update Question' : 'Create Question')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/questions')}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestionForm;
