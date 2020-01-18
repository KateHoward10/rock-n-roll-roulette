import React, { useState } from 'react';
import './App.css';
import { access_token, playlist_id } from './secrets';

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});

  return (
    <React.Fragment>
      <h1>Rock 'n' Roll! 🎶</h1>
      <button>Get new song</button>
      <h2>{currentTrack?.song}</h2>
      <h3>{currentTrack?.artist}</h3>
    </React.Fragment>
  );
}

export default App;
