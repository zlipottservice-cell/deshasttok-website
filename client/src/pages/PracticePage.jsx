import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestions } from '../services/api';
import { Loader2, Timer, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PracticePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const config = location.state?.config;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(config?.timeLimit ? config.timeLimit * 60 : null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [scores, setScores] = useState({ correct: 0, wrong: 0, skipped: 0 });

    // Redirect if no config
    useEffect(() => {
        if (!config) {
            navigate('/');
        }
    }, [config, navigate]);

    // Timer Logic
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || completed) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, completed]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Fetch Questions
    useEffect(() => {
        if (!config) return;

        const loadQuestions = async () => {
            setLoading(true);
            try {
                const params = {
                    difficulty: config.difficulty,
                    limit: config.limit
                };

                if (config.type === 'exam') {
                    params.exam = config.value;
                } else if (config.type === 'class') {
                    params.standard = config.value;
                }

                if (config.subject) {
                    params.subject = config.subject;
                }
                if (config.chapter && config.chapter !== 'All Chapters') {
                    params.chapter = config.chapter;
                }

                const data = await fetchQuestions(params);
                setQuestions(data);
            } catch (err) {
                setError("Failed to load questions. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [config]);

    const handleNext = () => {
        if (!isAnswered) {
            setScores(prev => ({ ...prev, skipped: prev.skipped + 1 }));
        }

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setIsAnswered(false);
        } else {
            setCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(prev => prev - 1);
            setIsAnswered(true); // Since it was already answered
        }
    };

    const handleAnswer = (isCorrect) => {
        if (isAnswered) return;
        setIsAnswered(true);
        if (isCorrect) {
            setScores(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScores(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }
    };

    if (!config) return null;

    const accuracy = scores.correct + scores.wrong > 0
        ? Math.round((scores.correct / (scores.correct + scores.wrong)) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Sticky Timer Bar */}
            {config.timeLimit > 0 && (
                <div className={`sticky top-0 z-10 text-white py-3 px-4 shadow-md flex justify-center items-center font-mono font-bold text-xl ${timeLeft < 60 ? 'bg-red-600 animate-pulse' : 'bg-indigo-900'
                    }`}>
                    <Timer className="mr-2 h-6 w-6" />
                    {formatTime(timeLeft)}
                </div>
            )}

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                {!completed && (
                    <button
                        onClick={() => navigate('/setup', { state: { type: config.type, value: config.value } })}
                        className="mb-6 flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Setup
                    </button>
                )}

                {!completed && (
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{config.value} Practice</h2>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {config.difficulty}
                                </span>
                                {config.subjectName && (
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        {config.subjectName}
                                    </span>
                                )}
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {questions.length > 0 ? `Question ${currentIdx + 1} of ${questions.length}` : '0 Questions'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-600" />
                        <p>Loading your personalized session...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center">
                        {error}
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                        <p className="text-gray-500 text-lg mb-4">No questions found for these settings.</p>
                        <button
                            onClick={() => navigate('/setup', { state: { type: config.type, value: config.value } })}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Try changing the difficulty
                        </button>
                    </div>
                ) : completed ? (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
                            <div className="bg-indigo-900 p-8 text-center text-white">
                                <h3 className="text-3xl font-bold mb-2">Practice Complete!</h3>
                                <p className="text-indigo-200">Here's how you performed in this session</p>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total</p>
                                        <p className="text-3xl font-black text-gray-900">{questions.length}</p>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                                        <p className="text-green-600 text-sm font-bold uppercase tracking-wider mb-1">Correct</p>
                                        <p className="text-3xl font-black text-green-700">{scores.correct}</p>
                                    </div>
                                    <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
                                        <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-1">Wrong</p>
                                        <p className="text-3xl font-black text-red-700">{scores.wrong}</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                                        <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-1">Skipped</p>
                                        <p className="text-3xl font-black text-blue-700">{scores.skipped}</p>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 rounded-2xl p-8 mb-8 flex flex-col items-center">
                                    <p className="text-indigo-900 font-bold uppercase tracking-widest text-sm mb-4">Accuracy Score</p>
                                    <div className="relative h-40 w-40 flex items-center justify-center">
                                        <svg className="h-full w-full rotate-[-90deg]">
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-indigo-100" />
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * accuracy) / 100} className="text-indigo-600 transition-all duration-1000 ease-out" strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute text-4xl font-black text-indigo-900">{accuracy}%</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
                                    >
                                        Restart Practice
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <QuestionCard
                            key={questions[currentIdx]?.id || currentIdx}
                            question={questions[currentIdx]}
                            index={currentIdx}
                            onAnswer={handleAnswer}
                        />

                        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <button
                                onClick={handlePrev}
                                disabled={currentIdx === 0}
                                className={`px-6 py-2 rounded-lg font-bold transition-all ${currentIdx === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                    }`}
                            >
                                Previous
                            </button>

                            <div className="flex gap-4">
                                {!isAnswered && (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 text-gray-500 font-bold hover:text-indigo-600 transition-colors"
                                    >
                                        Skip
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className={`px-8 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${isAnswered
                                        ? 'bg-green-600 text-white hover:bg-green-700 animate-pulse'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {currentIdx === questions.length - 1 ? 'Finish' : isAnswered ? 'Continue' : 'Next Question'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PracticePage;
