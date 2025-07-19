export const login = async (data) => {
  console.log('Sending login request:', data);
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
  const result = await response.json();
  console.log('Login response:', result);
  return result;
};

export const register = async (data) => {
  console.log('Sending register request:', data);
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
  const result = await response.json();
  console.log('Register response:', result);
  return result;
};

export const getCurrentUser = async (token) => {
  console.log('Fetching current user with token:', token.slice(0, 10) + '...');
  const response = await fetch('http://localhost:8000/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao buscar usuário');
  }
  const result = await response.json();
  console.log('Get current user response:', result);
  return result;
};

export const getMessages = async (token) => {
  console.log('Fetching inbox with token:', token.slice(0, 10) + '...');
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
  console.log('Fetching sent messages with token:', token.slice(0, 10) + '...');
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
  console.log('Fetching user by contact:', contact);
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

export const sendMessage = async (token, data) => {
  console.log('Sending message:', data);
  const response = await fetch('http://localhost:8000/api/messages/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao enviar mensagem');
  }
  const result = await response.json();
  console.log('Send message response:', result);
  return result;
};