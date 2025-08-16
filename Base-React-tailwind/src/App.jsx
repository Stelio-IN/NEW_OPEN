import React, { useState, useEffect } from 'react';
import ChatContainer from './components/Chat/ChatContainer';
import AuthContainer from './components/Auth/AuthContainer';
import Chatbot from './components/Chatbot/Chatbot'; // Import the new Chatbot component
import { getCurrentUser } from './services/api';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to toggle chatbot

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

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
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
      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        aria-label="Toggle Chatbot"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
      {/* Chatbot Window */}
      {isChatbotOpen && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default App;