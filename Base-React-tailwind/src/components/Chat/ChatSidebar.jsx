import React from 'react';

const ChatSidebar = ({ 
  conversations, 
  activeChat, 
  setActiveChat, 
  isLoading, 
  onNewChat,
  onLogout,
  currentUser
}) => {
  const handleLogout = () => {
    console.log('Logout button clicked, onLogout:', typeof onLogout);
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      console.error('onLogout is not a function');
    }
  };

  return (
    <div className="w-80 bg-white border-r overflow-y-auto flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{currentUser?.username || 'Usuário'}</h3>
            <p className="text-sm text-gray-500">{currentUser?.phone || 'Sem telefone'}</p>
          </div>
        </div>
      </div>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">Conversas</h3>
        <button
          onClick={onNewChat}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          + Nova
        </button>
      </div>
      {isLoading ? (
        <div className="p-4 text-center">Carregando...</div>
      ) : (
        <div className="divide-y flex-1">
          {Array.isArray(conversations) && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.userId}
                className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center ${
                  activeChat?.userId === conversation.userId ? 'bg-blue-50' : ''
                }`}
                onClick={() => setActiveChat(conversation)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  {conversation.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium">{conversation.username || 'Desconhecido'}</div>
                    {conversation.unread && (
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        1
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {conversation.messages?.length > 0 
                      ? conversation.messages[conversation.messages.length - 1].content
                      : 'Nenhuma mensagem'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">Nenhuma conversa disponível</div>
          )}
        </div>
      )}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full text-red-500 hover:text-red-700 text-sm font-medium text-left"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;