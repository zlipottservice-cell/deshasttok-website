import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, adminLogout } from '../../services/api';
import { BarChart3, FileText, LogOut, Plus, Settings, Upload } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await adminLogout();
        navigate('/admin/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-gray-600">Loading...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total || 0}</p>
                            </div>
                            <FileText className="h-12 w-12 text-indigo-600" />
                        </div>
                    </div>

                    {stats?.byDifficulty?.map((item) => (
                        <div key={item.difficulty} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{item.difficulty}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{item.count}</p>
                                </div>
                                <BarChart3 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <button
                        onClick={() => navigate('/admin/questions')}
                        className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-indigo-600 p-6 text-left transition-all group"
                    >
                        <FileText className="h-10 w-10 text-indigo-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Questions</h3>
                        <p className="text-gray-600 text-sm">View, edit, and delete questions</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/questions/new')}
                        className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-green-600 p-6 text-left transition-all group"
                    >
                        <Plus className="h-10 w-10 text-green-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Add Question</h3>
                        <p className="text-gray-600 text-sm">Create a new question</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/upload')}
                        className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-purple-600 p-6 text-left transition-all group"
                    >
                        <Upload className="h-10 w-10 text-purple-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Bulk Upload</h3>
                        <p className="text-gray-600 text-sm">Upload questions via CSV</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-orange-600 p-6 text-left transition-all group"
                    >
                        <Settings className="h-10 w-10 text-orange-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Edit Categories</h3>
                        <p className="text-gray-600 text-sm">Manage exams, subjects & chapters</p>
                    </button>
                </div>

                {/* Questions by Exam */}
                {stats?.byExam && stats.byExam.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Questions by Exam</h3>
                        <div className="space-y-3">
                            {stats.byExam.map((item) => (
                                <div key={item.exam} className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">{item.exam}</span>
                                    <span className="text-gray-900 font-bold">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
