import React, { useState } from 'react';

const QuestionCard = ({ question, index, onAnswer, isGlass }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleOptionClick = (optionKey) => {
        if (selectedOption) return;
        setSelectedOption(optionKey);
        setShowExplanation(true);
        if (onAnswer) onAnswer(optionKey === question.correct_option);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-8">
                <div className="flex items-start gap-8">
                    <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-indigo-500/10 text-indigo-500 font-black rounded-2xl border border-indigo-500/20 text-2xl">
                        {index + 1}
                    </span>
                    <p className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                        {question.question_text}
                    </p>
                </div>

                {question.question_image_url && (
                    <div className="rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 p-3">
                        <img src={question.question_image_url} alt="Question Context" className="w-full rounded-[1.5rem]" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['A', 'B', 'C', 'D'].map((key) => {
                    const isCorrect = key === question.correct_option;
                    const isSelected = selectedOption === key;

                    let style = "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900";
                    if (selectedOption) {
                        if (isCorrect) style = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
                        else if (isSelected) style = "bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
                        else style = "bg-slate-950/20 border-slate-900 opacity-40 grayscale";
                    }

                    return (
                        <div
                            key={key}
                            onClick={() => handleOptionClick(key)}
                            className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-6 group/opt ${style}`}
                        >
                            <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${isSelected || (selectedOption && isCorrect) ? 'bg-white/10' : 'bg-slate-900 group-hover/opt:bg-slate-800'}`}>
                                {key}
                            </span>
                            <span className="font-bold text-lg tracking-wide">{question[`option_${key.toLowerCase()}`]}</span>
                        </div>
                    );
                })}
            </div>

            {showExplanation && (
                <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-10 md:p-14 space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                            <span className="text-emerald-400 font-black text-xl">✓</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white tracking-widest uppercase">Expert Analysis</h4>
                            <p className="text-xs font-bold text-emerald-500/60 uppercase tracking-widest">Correct Solution Verified</p>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <p className="text-slate-300 text-xl leading-relaxed font-medium italic">
                            {question.explanation || `Strategic Analysis: The optimal response corresponds to Option ${question.correct_option}. Review the core principles governing this module for deeper understanding.`}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
