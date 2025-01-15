import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './ChatInput.css';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleSend = () => {
    onSend(input || transcript);
    setInput('');
    resetTranscript();
  };

  return (
    <div className="chat-input">
      <textarea
        value={input || transcript}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Unesite pitanje..."
      />
      <button onClick={handleSend} disabled={!input && !transcript}>Pošalji</button>
      <button onClick={SpeechRecognition.startListening}>Govori</button>
      {listening && <p>Govori...</p>}
    </div>
  );
};

export default ChatInput;
