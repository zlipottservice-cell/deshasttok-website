import React, { useState } from 'react';

const QuestionCard = ({ question, index, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleOptionClick = (optionKey) => {
        if (selectedOption) return; // Prevent changing answer
        setSelectedOption(optionKey);
        setShowExplanation(true);
        if (onAnswer) {
            onAnswer(optionKey === question.correct_option);
        }
    };

    const getOptionClass = (optionKey) => {
        if (!selectedOption) return "bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300";

        if (optionKey === question.correct_option) {
            return "bg-green-100 border-green-500 text-green-700";
        }

        if (selectedOption === optionKey && selectedOption !== question.correct_option) {
            return "bg-red-100 border-red-500 text-red-700";
        }

        return "bg-gray-50 border-gray-200 opacity-50";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full">
                    {index + 1}
                </span>
                <div className="flex-1">
                    <p className="text-lg font-medium text-gray-900 mb-2">{question.question_text}</p>

                    {question.question_image && (
                        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                            <img src={question.question_image} alt="Question" className="max-w-full h-auto" />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-12">
                {['A', 'B', 'C', 'D'].map((key) => {
                    const optionText = question[`option_${key.toLowerCase()}`];
                    const optionImage = question[`option_${key.toLowerCase()}_image`];
                    return (
                        <div
                            key={key}
                            onClick={() => handleOptionClick(key)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${getOptionClass(key)}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="font-semibold flex-shrink-0">{key}.</span>
                                <div className="flex-1">
                                    {optionText && <span className="block mb-2">{optionText}</span>}
                                    {optionImage && (
                                        <img
                                            src={optionImage}
                                            alt={`Option ${key}`}
                                            className="max-w-full h-auto rounded border border-gray-300"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showExplanation && (
                <div className="ml-0 md:ml-12 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                    <p className="text-blue-800 mb-2">
                        {question.explanation || `The correct answer is Option ${question.correct_option}.`}
                    </p>
                    {question.explanation_image && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-blue-300">
                            <img
                                src={question.explanation_image}
                                alt="Explanation"
                                className="max-w-full h-auto"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
