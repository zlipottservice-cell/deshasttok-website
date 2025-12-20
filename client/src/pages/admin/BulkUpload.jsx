import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bulkUploadQuestions } from '../../services/api';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

const BulkUpload = () => {
    const navigate = useNavigate();
    const [csvText, setCsvText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = async () => {
        if (!csvText.trim()) {
            alert('Please paste CSV data');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            // Parse CSV
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            const questions = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                const question = {};
                headers.forEach((header, index) => {
                    question[header] = values[index] || '';
                });
                questions.push(question);
            }

            const response = await bulkUploadQuestions(questions);
            setResult(response);
        } catch (error) {
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const sampleCSV = `question_text,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty,exam,class,subject,chapter
"What is 2+2?","3","4","5","6","B","Basic addition","Easy","JEE",11,"Maths","Algebra"
"Capital of France?","London","Paris","Berlin","Rome","B","Paris is the capital","Easy","",10,"Geography","World Capitals"`;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Questions</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">CSV Format Instructions</h3>
                    <p className="text-blue-800 mb-4">
                        Your CSV should have the following columns (in this exact order):
                    </p>
                    <code className="block bg-white p-3 rounded text-sm text-gray-800 overflow-x-auto">
                        question_text,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty,exam,class,subject,chapter
                    </code>
                    <div className="mt-4">
                        <button
                            onClick={() => setCsvText(sampleCSV)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            Load Sample CSV
                        </button>
                    </div>
                </div>

                {/* CSV Input */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        Paste CSV Data
                    </label>
                    <textarea
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none font-mono text-sm"
                        placeholder="Paste your CSV data here..."
                    />
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={loading || !csvText.trim()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                    <Upload className="h-5 w-5" />
                    {loading ? 'Uploading...' : 'Upload Questions'}
                </button>

                {/* Results */}
                {result && (
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Results</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Successful</p>
                                    <p className="text-2xl font-bold text-green-900">{result.successCount}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                                <XCircle className="h-8 w-8 text-red-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Failed</p>
                                    <p className="text-2xl font-bold text-red-900">{result.errorCount}</p>
                                </div>
                            </div>
                        </div>

                        {result.errors && result.errors.length > 0 && (
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Errors:</h4>
                                <div className="space-y-2">
                                    {result.errors.map((err, idx) => (
                                        <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                                            <span className="font-medium">Row {err.row}:</span> {err.error}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/admin/questions')}
                            className="mt-4 w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                        >
                            View All Questions
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkUpload;
