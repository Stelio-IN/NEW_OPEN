import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message}
            isCurrentUser={message.isSender}
          />
        ))
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">Nenhuma mensagem ainda</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;