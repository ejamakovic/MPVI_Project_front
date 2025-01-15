import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatHistory.css';


const ChatHistory = ({ messages }) => {
  return (
    <div className="chat-history">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender === 'You' ? 'message-user' : 'message-bot'}`}>
          <div className="message-icon">
            <img
              src={msg.sender === 'You' ? '/images/user.png' : '/images/chef.jpg'}
              alt={msg.sender}
              className="icon"
            />
          </div>
          <div className="message-content">
            <strong>{msg.sender}:</strong>
            <div className="message-text">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
