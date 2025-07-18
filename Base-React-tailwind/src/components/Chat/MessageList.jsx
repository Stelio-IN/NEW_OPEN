import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-gray-50">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageItem 
              key={message.id} 
              message={message}
              isCurrentUser={message.isSender}
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-500">Nenhuma mensagem ainda</h3>
          <p className="text-gray-400">Envie sua primeira mensagem para começar a conversa</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;