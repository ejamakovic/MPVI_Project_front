import React, { useState } from 'react';
import axios from 'axios';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import ChatInput from './components/ChatInput/ChatInput';
import ChatHistory from './components/ChatHistory/ChatHistory';
import AudioUpload from './components/AudioUpload/AudioUpload';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputLanguage, setInputLanguage] = useState(null);
  const [outputLanguage, setOutputLanguage] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');

  const languageOptions = [
    { value: 'eng', label: 'English' },
    { value: 'bos', label: 'Bosnian' },
    { value: 'deu', label: 'German' },
    { value: 'fra', label: 'French' },
  ];

  const playAudioInBrowser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/text2audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: "Zdravo kako si?",  // Text to convert to audio
          src_lang: "bos",           // Source language (Bosnian)
          tgt_lang: "eng"            // Target language (English)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const blob = await response.blob();  // Get the audio file as a Blob
      const url = window.URL.createObjectURL(blob);  // Create a URL for the Blob
      setAudioUrl(url);  // Set the audio URL state to be used for playback
    } catch (error) {
      console.error(error);
      alert('Error generating audio');
    }
  };

  const handleSend = async (message) => {
    const newMessages = [...messages, { sender: 'You', text: message }];
    setMessages(newMessages);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generateText`, {
        user_message: message,
      });

      const reply = response.data.translated_text;
      setMessages([...newMessages, { sender: 'LLM', text: reply }]);
    } catch (error) {
      console.error('Error calling backend:', error);
      setMessages([ ...newMessages, { sender: 'LLM', text: 'An error occurred. Please try again.' } ]);
    }
  };

  const handleAudioUpload = async (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('src_lang', inputLanguage?.value);
    formData.append('target_lang', outputLanguage?.value);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/audio2text`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const transcribedText = response.data.transcribed_text;
      setTranscribedText(transcribedText);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  return (
    <div>
      <h1>LLM Chat</h1>
      <LanguageSelector
        selectedLanguage={inputLanguage}
        setSelectedLanguage={setInputLanguage}
        options={languageOptions}
      />
      <LanguageSelector
        selectedLanguage={outputLanguage}
        setSelectedLanguage={setOutputLanguage}
        options={languageOptions}
      />
      <ChatHistory messages={messages} />
      <ChatInput onSend={handleSend} />
      <AudioUpload onResult={handleAudioUpload} />

      {/* Audio Player to play audio in the browser */}
      {audioUrl && (
        <div>
          <h3>Audio Player</h3>
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Play Audio Button */}
      <button onClick={playAudioInBrowser}>
        Play Generated Audio
      </button>
    </div>
  );
};

export default App;
