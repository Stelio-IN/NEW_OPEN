import React, { useState } from 'react';
import { login, register } from '../../services/api';

const AuthContainer = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        const response = await login({
          phone: formData.phone,
          password: formData.password
        });
        onLoginSuccess(response.access_token, {
          id: response.user_id,
          username: response.username,
          phone: formData.phone
        });
      } else {
        await register({
          username: formData.username,
          phone: formData.phone,
          password: formData.password
        });
        setIsLogin(true);
        setError('Registro concluído! Faça login.');
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar solicitação');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {isLogin ? 'Login' : 'Registro'}
        </h2>
        {error && (
          <div className="p-2 mb-4 bg-red-100 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="+5511999999999"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
        >
          {isLogin ? 'Criar uma conta' : 'Já tenho uma conta'}
        </button>
      </div>
    </div>
  );
};

export default AuthContainer;