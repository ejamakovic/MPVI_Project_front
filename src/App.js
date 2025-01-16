import React, { useState, useRef } from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
          text: "Zdravo kako si?",  
          src_lang: "bos",          
          tgt_lang: "eng"           
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
    setMessages(newMessages);  // Update the UI with the new message
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generateText`, {
        src_lang: "eng",  // Use the input language from state
        message: message,  // Send only the new message, not the entire conversation
      });
  
      const reply = response.data.generated_text;
      setMessages([...newMessages, { sender: 'Chef', text: reply }]);  // Update UI with the chef's reply
    } catch (error) {
      console.error('Error calling backend:', error);
      setMessages([...newMessages, { sender: 'Chef', text: 'An error occurred. Please try again.' }]);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('src_lang', inputLanguage?.value);
        formData.append('target_lang', outputLanguage?.value);

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/audio2text`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          const transcribedText = response.data.transcribed_text;
          setTranscribedText(transcribedText);
        } catch (error) {
          console.error('Error sending recorded audio:', error);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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

      {/* Voice Recording Buttons */}
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
      </div>

      {/* Display Transcribed Text */}
      {transcribedText && (
        <div>
          <h3>Transcribed Text</h3>
          <p>{transcribedText}</p>
        </div>
      )}
    </div>
  );
};

export default App;