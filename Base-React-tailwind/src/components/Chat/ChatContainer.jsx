import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import NewChatForm from './NewChatForm';
import { getMessages, getSentMessages, getUserByContact, sendMessage } from '../../services/api';

const ChatContainer = ({ token, currentUser, onLogout }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [lastMessageIds, setLastMessageIds] = useState(new Set());

  const fetchMessages = async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsPolling(true);
      }
      setError(null);
      const [inboxRes, sentRes] = await Promise.all([
        getMessages(token),
        getSentMessages(token),
      ]);

      const allMessages = [...inboxRes, ...sentRes].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      // Check for new messages by comparing IDs
      const currentMessageIds = new Set(allMessages.map(msg => msg.id));
      if (currentMessageIds.size === lastMessageIds.size && 
          [...currentMessageIds].every(id => lastMessageIds.has(id))) {
        return; // No new messages, skip state update
      }
      setLastMessageIds(currentMessageIds);

      const conversationsMap = allMessages.reduce((acc, message) => {
        const otherUserId = 
          message.sender_id === currentUser.id 
            ? message.receiver_id 
            : message.sender_id;
            
        const otherUser = 
          message.sender_id === currentUser.id
            ? { 
                id: message.receiver_id, 
                username: message.receiver_username,
                phone: message.receiver_phone 
              }
            : { 
                id: message.sender_id, 
                username: message.sender_username,
                phone: message.sender_phone 
              };
        
        if (!acc[otherUserId]) {
          acc[otherUserId] = {
            userId: otherUserId,
            username: otherUser.username,
            phone: otherUser.phone,
            messages: [],
            lastMessage: message.timestamp,
            unread: message.receiver_id === currentUser.id && !message.read
          };
        }
        
        acc[otherUserId].messages.push({
          ...message,
          isSender: message.sender_id === currentUser.id
        });
        
        if (new Date(message.timestamp) > new Date(acc[otherUserId].lastMessage)) {
          acc[otherUserId].lastMessage = message.timestamp;
        }
        
        return acc;
      }, {});
      
      const sortedConversations = Object.values(conversationsMap).sort((a, b) => 
        new Date(b.lastMessage) - new Date(a.lastMessage)
      );
      
      sortedConversations.forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      });
      
      setConversations(sortedConversations);

      // Update activeChat if it exists
      if (activeChat) {
        const updatedActiveChat = sortedConversations.find(c => c.userId === activeChat.userId);
        if (updatedActiveChat) {
          setActiveChat({
            ...activeChat,
            messages: updatedActiveChat.messages,
            lastMessage: updatedActiveChat.lastMessage,
            unread: updatedActiveChat.unread
          });
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Falha ao carregar mensagens. Tente novamente.');
      if (error.message.includes('401')) {
        onLogout();
      }
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      }
      setIsPolling(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchMessages(true); // Initial fetch
      const intervalId = setInterval(() => fetchMessages(false), 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [token, currentUser, onLogout]);

  const handleStartNewChat = async (phone) => {
    try {
      setError(null);
      const normalizedPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\D/g, '');
      const user = await getUserByContact(token, normalizedPhone);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const existingConversation = conversations.find(c => c.userId === user.id);
      
      if (existingConversation) {
        setActiveChat(existingConversation);
      } else {
        const newConversation = {
          userId: user.id,
          username: user.username,
          phone: user.phone,
          messages: [],
          lastMessage: new Date().toISOString(),
          unread: false
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setActiveChat(newConversation);
      }
      
      setShowNewChat(false);
      setShowSidebar(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSendMessage = async (content) => {
    if (!activeChat || !content.trim()) return;
    
    try {
      setError(null);
      if (!activeChat.phone) {
        throw new Error('Número de telefone do destinatário não disponível');
      }

      const newMessage = await sendMessage(token, {
        receiver_phone: activeChat.phone,
        content,
      });
      
      setActiveChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            ...newMessage,
            isSender: true
          }
        ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
        lastMessage: newMessage.timestamp
      }));

      // Fetch updated messages to sync conversations
      await fetchMessages(false);
    } catch (error) {
      setError(error.message);
      console.error('Error sending message:', error);
    }
  };

  const handleViewContact = () => {
    setShowContactDetails(!showContactDetails);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        {showSidebar ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-80 bg-white border-r flex flex-col fixed md:relative inset-0 z-40 md:z-auto`}>
        <ChatSidebar 
          conversations={conversations}
          activeChat={activeChat}
          setActiveChat={(chat) => {
            setActiveChat(chat);
            setShowSidebar(false);
          }}
          isLoading={isInitialLoading}
          onNewChat={() => setShowNewChat(true)}
          currentUser={currentUser}
          onLogout={onLogout}
        />
      </div>
      
      {/* Main chat area */}
      <div className={`flex-1 flex flex-col ${!showSidebar ? 'md:ml-0' : ''}`}>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 text-center">
            {error}
          </div>
        )}
        
        {showNewChat ? (
          <NewChatForm 
            onStartChat={handleStartNewChat}
            onCancel={() => setShowNewChat(false)}
          />
        ) : activeChat ? (
          <>
            <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center">
                <button 
                  onClick={toggleSidebar}
                  className="md:hidden mr-2 text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                  {activeChat.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{activeChat.username}</h3>
                  <p className="text-xs text-gray-500">
                    {activeChat.messages.length > 0 ? (
                      new Date(activeChat.lastMessage).toLocaleString()
                    ) : 'Nova conversa'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleViewContact}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                {showContactDetails ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Ocultar
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Detalhes
                  </>
                )}
              </button>
            </div>
            
            {showContactDetails && (
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4">
                    {activeChat.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold">{activeChat.username}</h4>
                    <p className="text-sm text-gray-500">{activeChat.phone}</p>
                  </div>
                </div>
              </div>
            )}
            
            <MessageList 
              messages={activeChat.messages}
              currentUserId={currentUser.id}
            />
            
            <SendMessageForm 
              onSend={handleSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecione uma conversa</h3>
              <p className="text-gray-500 mb-4">Escolha um chat existente ou inicie uma nova conversa</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
              >
                Nova Conversa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;