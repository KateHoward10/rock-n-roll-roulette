import React, { useState, useEffect } from 'react';
import './App.css';
import { access_token, playlist_id } from './secrets';

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});

  function generate() {
    if (tracks?.length) {
      setCurrentTrack(tracks[Math.floor(Math.random() * tracks.length)]);
    }
  }

  useEffect(() => {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    fetch(endpoint, {
      method: 'get',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(blob => blob.json())
      .then(data => {
        const newTracks = data.items.map(item => {
          return {
            song: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(', '),
            uri: item.track.uri
          };
        });
        setTracks(newTracks);
      });
  }, []);

  return (
    <React.Fragment>
      <h1>
        Rock 'n' Roll!{' '}
        <span role="img" aria-label="musical notes">
          🎶
        </span>
      </h1>
      <button onClick={generate}>Get new song</button>
      <h2>{currentTrack?.song}</h2>
      <h3>{currentTrack?.artist}</h3>
    </React.Fragment>
  );
}

export default App;
