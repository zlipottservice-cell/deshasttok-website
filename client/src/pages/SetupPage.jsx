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
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-10">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black uppercase tracking-[0.2em] text-xs group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Dashboard
                </button>

                <div className="pro-card p-10 md:p-16 space-y-16">
                    <header className="space-y-6">
                        <div className="flex items-center gap-5 text-indigo-500">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                <Settings size={32} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tight">Configuration</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                                    {type}: {value}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-12">
                            <OptionGroup
                                label="Difficulty"
                                options={['Easy', 'Medium', 'Hard']}
                                selected={difficulty}
                                setSelected={setDifficulty}
                            />

                            <NumberGroup
                                label="Session Capacity"
                                value={questionCount}
                                setValue={setQuestionCount}
                                min={5}
                                max={50}
                                step={5}
                            />
                        </div>

                        <div className="space-y-12">
                            <Dropdown
                                label="Select Subject"
                                options={subjects}
                                selected={selectedSubject}
                                setSelected={setSelectedSubject}
                                placeholder="Choose a module"
                            />

                            <Dropdown
                                label="Practice Scope"
                                options={chapters}
                                selected={selectedChapter}
                                setSelected={setSelectedChapter}
                                placeholder="All Segments"
                            />
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-800">
                        <button
                            onClick={handleStart}
                            className="w-full btn-primary py-6 text-xl tracking-[0.3em] uppercase"
                        >
                            Initialize Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OptionGroup = ({ label, options, selected, setSelected }) => (
    <div className="space-y-5">
        <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.2em]">{label}</label>
        <div className="grid grid-cols-3 gap-3 p-2 bg-slate-950/50 rounded-2xl border border-slate-800">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${selected === opt
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-white'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

const NumberGroup = ({ label, value, setValue, min, max, step }) => (
    <div className="space-y-5">
        <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.2em]">{label}</label>
        <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded-2xl border border-slate-800">
            <button
                onClick={() => setValue(Math.max(min, value - step))}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white font-black text-2xl transition-colors"
            >
                -
            </button>
            <div className="text-center">
                <span className="text-3xl font-black text-white">{value}</span>
                <span className="block text-[10px] font-black text-slate-600 uppercase mt-1">Questions</span>
            </div>
            <button
                onClick={() => setValue(Math.min(max, value + step))}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white font-black text-2xl transition-colors"
            >
                +
            </button>
        </div>
    </div>
);

const Dropdown = ({ label, options, selected, setSelected, placeholder }) => (
    <div className="space-y-5">
        <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.2em]">{label}</label>
        <div className="relative group/select">
            <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white p-5 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer group-hover/select:border-slate-700 transition-all"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ArrowLeft size={16} className="rotate-[270deg]" />
            </div>
        </div>
    </div>
);

export default SetupPage;
