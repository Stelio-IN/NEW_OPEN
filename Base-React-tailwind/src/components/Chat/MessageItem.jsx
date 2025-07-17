import React from 'react';

const MessageItem = ({ message }) => {
  const isSent = message.isSender;

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        } ${message.is_fraudulent ? 'border-2 border-red-500' : ''}`}
      >
        {message.is_fraudulent && (
          <div className="text-red-600 text-xs mb-1 font-semibold">
            ⚠️ Atenção: Esta mensagem pode ser fraudulenta (Probabilidade: {Math.round(message.fraud_probability * 100)}%)
          </div>
        )}
        <p>{message.content}</p>
        <p className="text-xs mt-1 opacity-75">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;