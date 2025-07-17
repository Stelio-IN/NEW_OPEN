import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {isLogin ? (
        <LoginForm 
          onLoginSuccess={(token, user) => {
            onLoginSuccess(token, user);
          }} 
        />
      ) : (
        <RegisterForm onSuccess={() => setIsLogin(true)} />
      )}
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:text-blue-700"
        >
          {isLogin 
            ? 'Não tem uma conta? Registre-se' 
            : 'Já tem uma conta? Faça login'}
        </button>
      </div>
    </div>
  );
};

export default AuthContainer;