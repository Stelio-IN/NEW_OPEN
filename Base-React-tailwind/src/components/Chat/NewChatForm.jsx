import React, { useState } from 'react';

const NewChatForm = ({ onStartChat, onCancel }) => {
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setIsSearching(true);
    onStartChat(phone)
      .finally(() => setIsSearching(false));
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Nova Conversa</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+5511999999999"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? 'Procurando...' : 'Iniciar Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatForm;