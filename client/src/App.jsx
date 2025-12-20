import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SetupPage from './pages/SetupPage';
import PracticePage from './pages/PracticePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import QuestionManagement from './pages/admin/QuestionManagement';
import QuestionForm from './pages/admin/QuestionForm';
import BulkUpload from './pages/admin/BulkUpload';
import CategoryEditor from './pages/admin/CategoryEditor';

function App() {
  return (
    <div className="App font-sans antialiased text-gray-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/practice" element={<PracticePage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/questions" element={<QuestionManagement />} />
        <Route path="/admin/questions/new" element={<QuestionForm />} />
        <Route path="/admin/questions/edit/:id" element={<QuestionForm />} />
        <Route path="/admin/upload" element={<BulkUpload />} />
        <Route path="/admin/categories" element={<CategoryEditor />} />
      </Routes>
    </div>
  );
}

export default App;
