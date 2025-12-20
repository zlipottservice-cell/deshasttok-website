import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-8 w-8 text-indigo-600" />
                    <h1 className="text-xl font-bold text-gray-900">ExamPrep India</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium">
                        Start Practice
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                        Login
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
