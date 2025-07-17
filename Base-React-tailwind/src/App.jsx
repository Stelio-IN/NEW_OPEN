import React, { useState, useEffect } from 'react';
import AuthContainer from './components/Auth/AuthContainer';
import ChatContainer from './components/Chat/ChatContainer';
import { getCurrentUser } from './services/api';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const user = await getCurrentUser(token);
          setCurrentUser(user);
        } catch (error) {
          handleLogout();
        }
      };
      fetchUser();
    }
  }, [token]);

  const handleLoginSuccess = (token, user) => {
    setToken(token);
    setCurrentUser(user);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {token && currentUser ? (
        <ChatContainer 
          token={token} 
          currentUser={currentUser} 
          onLogout={handleLogout}
        />
      ) : (
        <AuthContainer onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;