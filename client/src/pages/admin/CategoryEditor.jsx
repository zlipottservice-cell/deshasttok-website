import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminCategories, updateCategory, createCategory } from '../../services/api';
import { ArrowLeft, Save, Plus, Edit2 } from 'lucide-react';

const CategoryEditor = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editConfig, setEditConfig] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getAdminCategories();
            setCategories(data);
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        const configStr = typeof category.config === 'string'
            ? category.config
            : JSON.stringify(category.config, null, 2);
        setEditConfig(configStr);
    };

    const handleSave = async (id) => {
        try {
            // Validate JSON
            JSON.parse(editConfig);
            await updateCategory(id, editConfig);
            setEditingId(null);
            loadCategories();
        } catch (error) {
            alert('Invalid JSON format or save failed');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditConfig('');
    };

    const formatConfigForDisplay = (configInput) => {
        try {
            const config = typeof configInput === 'string' ? JSON.parse(configInput) : configInput;
            return Object.entries(config).map(([subject, chapters]) =>
                `${subject}: ${chapters}`
            ).join('\n');
        } catch {
            return configInput;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Category Configuration</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">How to Edit</h3>
                    <p className="text-blue-800 mb-2">
                        The config field stores subjects and their chapters as JSON. Format:
                    </p>
                    <code className="block bg-white p-3 rounded text-sm text-gray-800">
                        {`{"Physics": "Kinematics,Thermodynamics", "Maths": "Calculus,Algebra"}`}
                    </code>
                </div>

                {/* Categories List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-600">Loading...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">No categories found</div>
                    ) : (
                        categories.map((cat) => (
                            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {cat.type === 'exam' ? 'Exam' : 'Class'}: {cat.value}
                                        </h3>
                                        <p className="text-sm text-gray-600">ID: {cat.id}</p>
                                    </div>
                                    {editingId !== cat.id && (
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {editingId === cat.id ? (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Configuration (JSON)
                                        </label>
                                        <textarea
                                            value={editConfig}
                                            onChange={(e) => setEditConfig(e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none font-mono text-sm mb-4"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleSave(cat.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                <Save className="h-4 w-4" />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                                            {formatConfigForDisplay(cat.config)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryEditor;
