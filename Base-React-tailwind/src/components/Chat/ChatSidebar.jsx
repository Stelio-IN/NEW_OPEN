import React from 'react';

const ChatSidebar = ({ conversations, activeChat, setActiveChat, isLoading, onNewChat, currentUser, onLogout }) => {
  return (
    <div className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-semibold">{currentUser?.username}</h2>
          </div>
          <button
            onClick={() => {
              console.log('Logout button clicked, onLogout:', typeof onLogout);
              onLogout();
            }}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Sair
          </button>
        </div>
      </div>
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
        >
          Nova Conversa
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-gray-500">Carregando...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-gray-500">Nenhuma conversa encontrada</div>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.userId}
              onClick={() => setActiveChat(conversation)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                activeChat?.userId === conversation.userId ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    {conversation.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${conversation.unread ? 'text-blue-600' : ''}`}>
                      {conversation.username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.messages[conversation.messages.length - 1]?.content || 'Sem mensagens'}
                    </p>
                  </div>
                </div>
                {conversation.unread && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;