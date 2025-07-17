const API_URL = 'http://localhost:8000/api';

export const getMessages = async (token) => {
  const response = await fetch(`${API_URL}/messages/inbox`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getSentMessages = async (token) => {
  const response = await fetch(`${API_URL}/messages/sent`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getUserProfile = async (token) => {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Erro ao obter perfil');
  
  return response.json();
};

export const getUserByContact = async (token, contactInfo) => {
  const response = await fetch(`${API_URL}/users/find?contact=${encodeURIComponent(contactInfo)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Erro ao buscar usuário');
  }
  
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: credentials.phone,
      password: credentials.password
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }
  
  return await response.json();
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return await response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }
  
  return response.json();
};