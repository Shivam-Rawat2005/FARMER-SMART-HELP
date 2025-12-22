import { useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { chatAPI } from '../services/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch previous messages
    fetchMessages();

    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join_chat', {
        userId: user._id,
        name: user.name,
        role: user.role
      });
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('user_typing', (data) => {
      if (data.userId !== user._id) {
        setTyping(true);
        setTimeout(() => setTyping(false), 3000);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      senderId: user._id,
      senderName: user.name,
      message: newMessage,
      role: user.role
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', {
        userId: user._id,
        name: user.name
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chat 💬</h1>
          <p className="text-gray-600 mt-2">
            Connect with {user.role === 'farmer' ? 'admins and dealers' : 'farmers'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Community Chat</h2>
                <p className="text-sm text-gray-500">
                  {connected ? (
                    <span className="text-green-600">● Connected</span>
                  ) : (
                    <span className="text-red-600">● Disconnected</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">({user.role})</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl">💬</span>
                  <p className="text-gray-600 mt-4">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isOwnMessage = msg.senderId?._id === user._id || msg.senderId === user._id;
                    
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            isOwnMessage
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-xs font-semibold ${
                              isOwnMessage ? 'text-primary-100' : 'text-gray-600'
                            }`}>
                              {msg.senderName}
                            </p>
                            {msg.senderId?.role && (
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                isOwnMessage 
                                  ? 'bg-primary-700 text-primary-100' 
                                  : 'bg-gray-300 text-gray-700'
                              }`}>
                                {msg.senderId.role}
                              </span>
                            )}
                          </div>
                          <p className="break-words">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-primary-200' : 'text-gray-500'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-600 px-4 py-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type your message..."
                  className="input-field flex-1"
                  disabled={!connected}
                />
                <button
                  type="submit"
                  disabled={!connected || !newMessage.trim()}
                  className="btn-primary"
                >
                  Send
                </button>
              </div>
              {!connected && (
                <p className="text-sm text-red-600 mt-2">
                  Disconnected from chat. Please refresh the page.
                </p>
              )}
            </form>
          </div>

          {/* Chat Guidelines */}
          <div className="card mt-6 bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">💡 Chat Guidelines</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Be respectful and professional</li>
              <li>• Share helpful farming tips and experiences</li>
              <li>• Ask questions and help fellow farmers</li>
              <li>• Avoid sharing personal sensitive information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
