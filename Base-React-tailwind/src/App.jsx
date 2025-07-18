import React, { useState, useEffect } from 'react';
import ChatContainer from './components/Chat/ChatContainer';
import AuthContainer from './components/Auth/AuthContainer';
import { getCurrentUser } from './services/api';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      console.log('Fetching user with token:', token.slice(0, 10) + '...');
      const fetchUser = async () => {
        try {
          setError(null);
          const user = await getCurrentUser(token);
          console.log('User fetched:', user);
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (error) {
          console.error('Error fetching user:', error.message);
          setError('Falha ao carregar perfil do usuário. Tente fazer login novamente.');
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
        }
      };
      fetchUser();
    }
  }, [token]);

  const handleLogin = (newToken, user) => {
    console.log('Logging in:', { newToken: newToken.slice(0, 10) + '...', user });
    setToken(newToken);
    setCurrentUser(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setError(null);
  };

  const handleLogout = () => {
    console.log('Executing logout');
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setError(null);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <div className="p-4 bg-red-100 text-red-700">
          {error}
        </div>
      )}
      {token && currentUser ? (
        <ChatContainer 
          token={token} 
          currentUser={currentUser} 
          onLogout={handleLogout}
        />
      ) : (
        <AuthContainer onLoginSuccess={handleLogin} />
      )}
    </div>
  );
};

export default App;