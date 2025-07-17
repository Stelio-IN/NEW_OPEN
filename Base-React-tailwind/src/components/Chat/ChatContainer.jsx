import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import NewChatForm from './NewChatForm';
import { getMessages, getSentMessages, getUserByContact } from '../../services/api';

const ChatContainer = ({ token, currentUser, onLogout }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [inboxRes, sentRes] = await Promise.all([
          getMessages(token),
          getSentMessages(token),
        ]);

        const allMessages = [...inboxRes, ...sentRes].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        
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
        if (activeChat) {
          const updatedActiveChat = sortedConversations.find(c => c.userId === activeChat.userId);
          if (updatedActiveChat) {
            setActiveChat(updatedActiveChat);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Falha ao carregar mensagens. Tente novamente.');
        if (error.response?.status === 401) {
          onLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchMessages();
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

      const response = await fetch('http://localhost:8000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_phone: activeChat.phone,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao enviar mensagem');
      }

      const newMessage = await response.json();
      
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

      const [inboxRes, sentRes] = await Promise.all([
        getMessages(token),
        getSentMessages(token),
      ]);
      
      const allMessages = [...inboxRes, ...sentRes].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      
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
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewContact = () => {
    setShowContactDetails(!showContactDetails);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar 
        conversations={conversations}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        isLoading={isLoading}
        onNewChat={() => setShowNewChat(true)}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex flex-col">
        {error && (
          <div className="p-4 bg-red-100 text-red-700">
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
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  {activeChat.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold">{activeChat.username}</h3>
              </div>
              <button
                onClick={handleViewContact}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                {showContactDetails ? 'Ocultar Contato' : 'Ver Contato'}
              </button>
            </div>
            {showContactDetails && (
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
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
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Selecione uma conversa ou inicie uma nova</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;