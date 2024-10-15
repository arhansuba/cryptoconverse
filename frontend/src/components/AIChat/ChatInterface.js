import React, { useState, useEffect, useRef } from 'react';
import { useAI } from '../../hooks/useAI';
import { useUser } from '../../contexts/UserContext';
import ResponseGenerator from './ResponseGenerator';
import { apiService } from '../../services/api';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { generateResponse, isLoading } = useAI();
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newUserMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');

    try {
      const aiResponse = await apiService.getChatbotResponse(input);
      const newAIMessage = { text: aiResponse.message, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, newAIMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = { text: 'Sorry, I encountered an error. Please try again.', sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="chat-interface">
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything about crypto..."
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;