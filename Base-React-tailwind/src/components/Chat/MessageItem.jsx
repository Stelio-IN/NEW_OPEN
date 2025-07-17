import React from 'react';
import dayjs from 'dayjs';

const MessageItem = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="text-sm">{message.content}</div>
        <div className={`text-xs mt-1 text-right ${
          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {dayjs(message.timestamp).format('HH:mm')}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;