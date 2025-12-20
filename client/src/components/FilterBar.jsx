import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ filters, selectedFilters, onFilterChange }) => {

    // Helper to ensure we have arrays even if data is loading/empty
    const exams = filters.exams || [];
    const boards = filters.boards || [];
    const classes = filters.classes || [];
    const subjects = filters.subjects || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...selectedFilters, [name]: value });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
                <Filter className="h-5 w-5" />
                <h3 className="font-semibold">Filters</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Exam Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Target Exam</label>
                    <select
                        name="exam"
                        value={selectedFilters.exam || ''}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
                    >
                        <option value="">All Exams</option>
                        {exams.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>

                {/* Board Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Board</label>
                    <select
                        name="board"
                        value={selectedFilters.board || ''}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
                    >
                        <option value="">All Boards</option>
                        {boards.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>

                {/* Class Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
                    <select
                        name="standard"
                        value={selectedFilters.standard || ''}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
                    >
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                </div>

                {/* Subject Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                    <select
                        name="subject"
                        value={selectedFilters.subject || ''}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
                    >
                        <option value="">All Subjects</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
