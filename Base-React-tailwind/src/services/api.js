const API_URL = 'http://localhost:8000/api';


export const getUserProfile = async (token) => {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Erro ao obter perfil');
  
  return response.json();
};

export const login = async (data) => {
  const response = await fetch('http://localhost:8000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao fazer login');
  }
  return await response.json();
};

export const register = async (data) => {
  const response = await fetch('http://localhost:8000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao registrar');
  }
  return await response.json();
};

export const getCurrentUser = async (token) => {
  const response = await fetch('http://localhost:8000/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao buscar usuário');
  }
  return await response.json();
};

export const getMessages = async (token) => {
  const response = await fetch('http://localhost:8000/api/messages/inbox', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao buscar mensagens');
  }
  return await response.json();
};

export const getSentMessages = async (token) => {
  const response = await fetch('http://localhost:8000/api/messages/sent', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao buscar mensagens enviadas');
  }
  return await response.json();
};

export const getUserByContact = async (token, contact) => {
  const response = await fetch(`http://localhost:8000/api/users/find?contact=${encodeURIComponent(contact)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Usuário não encontrado');
  }
  return await response.json();
};