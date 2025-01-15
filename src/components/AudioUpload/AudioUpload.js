import React, { useState } from 'react';
import axios from 'axios';

const AudioUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an audio file first.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('src_lang', 'eng'); // Example: Source language
    formData.append('target_lang', 'bos'); // Example: Target language

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/audio2text`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onResult(response.data.transcribed_text);
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  return (
    <div>
      <h2>Upload Audio</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Process</button>
    </div>
  );
};

export default AudioUpload;
