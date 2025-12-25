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
        <div className="min-h-screen p-6 md:p-12 flex flex-col">
            {/* Professional Session Header */}
            <header className="max-w-6xl mx-auto w-full pro-card p-6 md:p-8 flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/setup', { state: { type: config.type, value: config.value } })}
                        className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-white border border-slate-800 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white leading-tight">{config.subjectName}</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                            {config.chapterName} • {config.difficulty}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {timeLeft !== null && (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-950 rounded-xl border border-slate-800">
                            <Timer size={18} className={timeLeft < 60 ? "text-red-500 animate-pulse" : "text-indigo-400"} />
                            <span className={`font-black tracking-tighter text-lg ${timeLeft < 60 ? "text-red-500" : "text-white"}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    )}
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Session Progress</span>
                        <div className="flex gap-1.5">
                            {questions.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2.5 h-1 rounded-full transition-all duration-500 ${idx === currentIdx ? 'bg-indigo-500 w-6' : idx < currentIdx ? 'bg-emerald-500/50' : 'bg-slate-800'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto w-full flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Initializing Session...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="pro-card p-20 text-center space-y-8">
                        <p className="text-2xl font-bold text-slate-300">No content matches your selection.</p>
                        <button onClick={() => navigate(-1)} className="btn-primary">Refine Settings</button>
                    </div>
                ) : completed ? (
                    <div className="pro-card overflow-hidden">
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-16 text-center border-b border-slate-800">
                            <h3 className="text-6xl font-black text-white tracking-widest uppercase mb-4">Complete</h3>
                            <p className="text-slate-400 font-bold tracking-[0.2em]">Session Analysis Finalized</p>
                        </div>
                        <div className="p-16 space-y-16">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <EndStat label="Total" val={questions.length} />
                                <EndStat label="Correct" val={scores.correct} accent="text-emerald-400" />
                                <EndStat label="Wrong" val={scores.wrong} accent="text-red-400" />
                                <EndStat label="Accuracy" val={`${accuracy}%`} />
                            </div>
                            <div className="flex justify-center">
                                <button onClick={() => window.location.reload()} className="btn-primary px-20">New Session</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="pro-card p-10 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <QuestionCard
                            question={questions[currentIdx]}
                            index={currentIdx}
                            onAnswer={handleAnswer}
                            isGlass={true}
                        />

                        <div className="mt-16 flex items-center justify-between pt-8 border-t border-slate-800">
                            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                Step <span className="text-white">{currentIdx + 1}</span> of <span className="text-slate-600">{questions.length}</span>
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={!isAnswered}
                                className={`flex items-center gap-3 btn-primary py-4 px-10 tracking-[0.2em] uppercase text-sm ${!isAnswered && 'opacity-30 cursor-not-allowed grayscale'}`}
                            >
                                {currentIdx === questions.length - 1 ? 'Finish Session' : 'Continue'}
                                <ArrowLeft size={18} className="rotate-180" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const EndStat = ({ label, val, accent = "text-white" }) => (
    <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-4xl font-black ${accent}`}>{val}</p>
    </div>
);

export default PracticePage;
