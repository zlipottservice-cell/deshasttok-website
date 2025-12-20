import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Existing exports
export const fetchQuestions = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/questions`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

export const fetchConfig = async (type, value) => {
    try {
        const response = await axios.get(`${API_URL}/config`, { params: { type, value } });
        return response.data;
    } catch (error) {
        console.error("Error fetching config:", error);
        throw error;
    }
}

// Admin API functions
const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminLogin = async (username, password) => {
    const response = await axios.post(`${API_URL}/admin/login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
};

export const adminLogout = async () => {
    try {
        await axios.post(`${API_URL}/admin/logout`, {}, { headers: getAuthHeader() });
    } finally {
        localStorage.removeItem('adminToken');
    }
};

export const getAdminQuestions = async (params) => {
    const response = await axios.get(`${API_URL}/admin/questions`, {
        params,
        headers: getAuthHeader()
    });
    return response.data;
};

export const createQuestion = async (questionData) => {
    const response = await axios.post(`${API_URL}/admin/questions`, questionData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateQuestion = async (id, questionData) => {
    const response = await axios.put(`${API_URL}/admin/questions/${id}`, questionData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteQuestion = async (id) => {
    const response = await axios.delete(`${API_URL}/admin/questions/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getAdminCategories = async () => {
    const response = await axios.get(`${API_URL}/admin/categories`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateCategory = async (id, config) => {
    const response = await axios.put(`${API_URL}/admin/categories/${id}`, { config }, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/admin/categories`, categoryData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getAdminStats = async () => {
    const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const bulkUploadQuestions = async (questions) => {
    const response = await axios.post(`${API_URL}/admin/questions/bulk`, { questions }, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_URL}/admin/upload-image`, formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data.url;
};

