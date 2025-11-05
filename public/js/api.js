// API Configuration
const API_URL = 'http://localhost:5000/api';

// API Helper Functions
const api = {
    // Auth endpoints
    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return response.json();
    },

    logout: async (token) => {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    getProfile: async (token) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    updateProfile: async (token, profileData) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        return response.json();
    },

    // Transaction endpoints
    getTransactions: async (token) => {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    getTransaction: async (token, id) => {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    createTransaction: async (token, transactionData) => {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });
        return response.json();
    },

    updateTransaction: async (token, id, transactionData) => {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });
        return response.json();
    },

    deleteTransaction: async (token, id) => {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    // Saving Goal endpoints
    getSavingGoals: async (token) => {
        const response = await fetch(`${API_URL}/saving-goals`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    getSavingGoal: async (token, id) => {
        const response = await fetch(`${API_URL}/saving-goals/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    createSavingGoal: async (token, goalData) => {
        const response = await fetch(`${API_URL}/saving-goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(goalData)
        });
        return response.json();
    },

    updateSavingGoal: async (token, id, goalData) => {
        const response = await fetch(`${API_URL}/saving-goals/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(goalData)
        });
        return response.json();
    },

    deleteSavingGoal: async (token, id) => {
        const response = await fetch(`${API_URL}/saving-goals/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    // Investment endpoints
    getInvestments: async (token) => {
        const response = await fetch(`${API_URL}/investments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    getInvestment: async (token, id) => {
        const response = await fetch(`${API_URL}/investments/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    createInvestment: async (token, investmentData) => {
        const response = await fetch(`${API_URL}/investments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(investmentData)
        });
        return response.json();
    },

    updateInvestment: async (token, id, investmentData) => {
        const response = await fetch(`${API_URL}/investments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(investmentData)
        });
        return response.json();
    },

    deleteInvestment: async (token, id) => {
        const response = await fetch(`${API_URL}/investments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};
