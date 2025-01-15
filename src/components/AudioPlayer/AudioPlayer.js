import React from 'react';

const AudioPlayer = ({ audioUrl }) => {
  if (!audioUrl) return null;

  return (
    <div>
      <h2>Generated Audio</h2>
      <audio controls>
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
