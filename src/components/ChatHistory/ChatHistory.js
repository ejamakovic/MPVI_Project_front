import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatHistory.css';

const ChatHistory = ({ messages }) => {
  return (
    <div className="chat-history">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender === 'Vi' ? 'message-user' : 'message-bot'}`}>
          <strong>{msg.sender}:</strong>
          <div className="message-text">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
