import React from 'react';

const MessageItem = ({ message }) => {
  const isSent = message.isSender;
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
          isSent 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        } ${message.is_fraudulent ? 'border-2 border-red-500' : ''}`}
      >
        {message.is_fraudulent && (
          <div className="text-red-600 text-xs mb-1 font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Atenção: Mensagem suspeita ({Math.round(message.fraud_probability * 100)}%)
          </div>
        )}
        <p className="break-words">{message.content}</p>
        <p className={`text-xs mt-1 text-right ${
          isSent ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;