import React from 'react';

const ChatSidebar = ({ conversations, activeChat, setActiveChat, isLoading, onNewChat, currentUser, onLogout }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold mr-3">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-semibold text-white">{currentUser?.username}</h2>
          </div>
          <button
            onClick={onLogout}
            className="text-white hover:text-blue-200 text-sm font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* New chat button */}
      <div className="p-4 border-b">
        <button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Conversa
        </button>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Carregando conversas...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhuma conversa</h3>
            <p className="text-sm text-gray-500">Inicie uma nova conversa para começar</p>
          </div>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.userId}
              onClick={() => setActiveChat(conversation)}
              className={`p-4 border-b cursor-pointer transition-colors ${
                activeChat?.userId === conversation.userId 
                  ? 'bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-bold mr-3">
                    {conversation.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-sm font-semibold truncate ${
                      conversation.unread ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {conversation.username}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.messages.length > 0 ? (
                        conversation.messages[conversation.messages.length - 1].content
                      ) : 'Sem mensagens'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {conversation.messages.length > 0 && (
                      new Date(conversation.lastMessage).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    )}
                  </span>
                  {conversation.unread && (
                    <span className="mt-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      !
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;