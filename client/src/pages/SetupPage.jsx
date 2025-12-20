import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Settings, Clock, Layers, BookOpen, ArrowLeft } from 'lucide-react';
import { fetchConfig } from '../services/api';

const SetupPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, value } = location.state || { type: 'exam', value: 'JEE' }; // Default if navigated directly

    const [difficulty, setDifficulty] = useState('Medium');
    const [questionCount, setQuestionCount] = useState(20);
    const [timeLimit, setTimeLimit] = useState(0); // 0 means no limit

    // Config State
    const [configData, setConfigData] = useState(null); // The full parsed JSON object { "Subject": "Chap1,Chap2" }
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState('All Chapters');
    const [loading, setLoading] = useState(true);

    // Fetch Configuration (Categories Table)
    useEffect(() => {
        const loadConfig = async () => {
            setLoading(true);
            try {
                console.log('Fetching config for:', type, value);
                // Fetch the single row for this Exam/Class
                // This calls /api/config?type=...&value=...
                const rows = await fetchConfig(type, value);
                console.log('Received rows:', rows);

                if (rows && rows.length > 0) {
                    try {
                        // The 'config' column contains the JSON string (or auto-parsed object)
                        const rawConfig = rows[0].config;
                        console.log('Raw config:', rawConfig);

                        const parsedConfig = typeof rawConfig === 'string' ? JSON.parse(rawConfig) : rawConfig;
                        console.log('Parsed config:', parsedConfig);
                        setConfigData(parsedConfig);

                        const subjList = Object.keys(parsedConfig);
                        console.log('Subject list:', subjList);
                        setSubjects(subjList);
                        if (subjList.length > 0) {
                            setSelectedSubject(subjList[0]);
                            console.log('Auto-selected subject:', subjList[0]);
                        }
                    } catch (e) {
                        console.error("Failed to parse config JSON", e);
                    }
                } else {
                    console.warn('No config rows returned from API');
                }
            } catch (err) {
                console.error('Error loading config:', err);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
    }, [type, value]);

    // Update Chapters when Subject changes
    useEffect(() => {
        if (!selectedSubject || !configData) {
            setChapters([]);
            return;
        }

        // Get the list of chapters for the subject
        const rawChapters = configData[selectedSubject];
        if (rawChapters) {
            const chapList = Array.isArray(rawChapters)
                ? rawChapters
                : rawChapters.split(',').map(c => c.trim());
            setChapters(chapList);
        } else {
            setChapters([]);
        }
        setSelectedChapter('All Chapters');
    }, [selectedSubject, configData]);


    const handleStart = () => {
        navigate('/practice', {
            state: {
                config: {
                    type,
                    value,
                    difficulty,
                    limit: questionCount,
                    timeLimit,
                    subject: selectedSubject,
                    chapter: selectedChapter,
                    // For display
                    subjectName: selectedSubject,
                    chapterName: selectedChapter
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-600 px-8 py-6 text-white">
                        <div className="flex items-center gap-2 mb-1 opacity-90 text-indigo-100 uppercase tracking-wide text-xs font-bold">
                            Setup Practice
                        </div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            {type === 'exam' ? <BookOpen /> : <Layers />}
                            {type === 'exam' ? `${value} Practice` : `Class ${value} Practice`}
                        </h1>
                    </div>

                    <div className="p-8 space-y-8">

                        {/* Subject & Chapter Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                                    Subject
                                </label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 focus:border-indigo-600 focus:outline-none transition-colors"
                                    disabled={loading}
                                >
                                    {subjects.map(subj => (
                                        <option key={subj} value={subj}>{subj}</option>
                                    ))}
                                    {loading && <option>Loading setup...</option>}
                                    {!loading && subjects.length === 0 && <option>No subjects found</option>}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                                    Chapter
                                </label>
                                <select
                                    value={selectedChapter}
                                    onChange={(e) => setSelectedChapter(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 focus:border-indigo-600 focus:outline-none transition-colors"
                                    disabled={!selectedSubject || loading}
                                >
                                    <option value="All Chapters">All Chapters</option>
                                    {chapters.map(chap => (
                                        <option key={chap} value={chap}>{chap}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Difficulty Section */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                                Difficulty Level
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Easy', 'Medium', 'Hard', 'Mixed'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setDifficulty(level)}
                                        className={`py-3 px-4 rounded-lg font-medium border-2 transition-all ${difficulty === level
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Count Section */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                                Number of Questions
                            </label>
                            <div className="flex items-center gap-4">
                                {[10, 20, 50, 100].map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setQuestionCount(count)}
                                        className={`h-12 w-12 rounded-full flex items-center justify-center font-bold border-2 transition-all ${questionCount === count
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Limit Section */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Time Limit (Minutes)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[0, 15, 30, 60].map((mins) => (
                                    <button
                                        key={mins}
                                        onClick={() => setTimeLimit(mins)}
                                        className={`py-3 px-4 rounded-lg font-medium border-2 transition-all ${timeLimit === mins
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {mins === 0 ? 'No Limit' : `${mins} min`}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* Action Button */}
                        <div className="pt-6 border-t border-gray-100">
                            <button
                                onClick={handleStart}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                Start Practice Session
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default SetupPage;
