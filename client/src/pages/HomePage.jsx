import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { BookOpen, GraduationCap, School } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();

    const handleSelection = (type, value) => {
        // value could be 'JEE', 'NEET', or class number like '10', '12'
        navigate('/setup', { state: { type, value } });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

                <section className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Master Your Preparation
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Select your target exam or class to start a personalized practice session designed to boost your score.
                    </p>
                </section>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-indigo-600" />
                        Competitive Exams
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['JEE', 'NEET'].map((exam) => (
                            <div
                                key={exam}
                                onClick={() => handleSelection('exam', exam)}
                                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-indigo-200 cursor-pointer transition-all hover:-translate-y-1 group"
                            >
                                <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-600">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{exam}</h3>
                                <p className="text-gray-500">Comprehensive practice for {exam} aspirants.</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <School className="h-6 w-6 text-indigo-600" />
                        Explore by Class
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[12, 11, 10, 9, 8, 7, 6, 5].map((cls) => (
                            <div
                                key={cls}
                                onClick={() => handleSelection('class', cls)}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all text-center group"
                            >
                                <div className="text-3xl font-bold text-gray-300 group-hover:text-indigo-600 mb-2 transition-colors">
                                    {cls}
                                </div>
                                <div className="text-sm font-medium text-gray-600">Class {cls}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default HomePage;
