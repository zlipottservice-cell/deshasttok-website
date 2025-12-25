import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { BookOpen, GraduationCap, School, ArrowLeft } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();

    const handleSelection = (type, value) => {
        navigate('/setup', { state: { type, value } });
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-16">
                <header className="text-center space-y-6 py-12">
                    <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter text-glow-subtle">
                        Edu<span className="text-indigo-500">In</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                        Professional practice platform for competitive excellence and academic mastery.
                    </p>
                </header>

                <Section title="Competitive Track" icon={<div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><BookOpen className="text-indigo-400" size={28} /></div>}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {['JEE', 'NEET'].map((exam) => (
                            <div
                                key={exam}
                                onClick={() => handleSelection('exam', exam)}
                                className="pro-card pro-card-hover p-12 flex flex-col justify-between cursor-pointer min-h-[300px]"
                            >
                                <div>
                                    <h3 className="text-5xl font-black text-white mb-4 tracking-tight">{exam}</h3>
                                    <p className="text-slate-500 text-xl">Comprehensive preparation modules for {exam} aspirants.</p>
                                </div>
                                <button className="mt-8 flex items-center text-indigo-400 font-bold text-xl group w-fit">
                                    Start Session <ArrowLeft className="ml-3 rotate-180 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="School Curriculum" icon={<div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><School className="text-emerald-400" size={28} /></div>}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[12, 11, 10, 9, 8, 7, 6, 5].map((cls) => (
                            <div
                                key={cls}
                                onClick={() => handleSelection('class', cls)}
                                className="pro-card pro-card-hover p-8 text-center cursor-pointer group"
                            >
                                <div className="text-5xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors">
                                    {cls}
                                </div>
                                <div className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">Grade {cls}</div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
};

const Section = ({ title, icon, children }) => (
    <section className="space-y-8">
        <div className="flex items-center gap-4">
            {icon}
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">{title}</h2>
        </div>
        {children}
    </section>
);

export default HomePage;
