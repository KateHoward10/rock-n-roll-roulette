import React, { useState, useEffect } from 'react';
import './App.css';
import { client_id, redirect_uri, playlist_id } from './secrets';

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [token, setToken] = useState(null);
  const scopes = ['user-read-currently-playing', 'user-read-playback-state'];

  function generate() {
    if (tracks?.length) {
      setCurrentTrack(tracks[Math.floor(Math.random() * tracks.length)]);
    }
  }

  function getAllTracks() {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    if (token) {
      fetch(endpoint, {
        method: 'get',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(blob => blob.json())
        .then(data => {
          if (data?.items) {
            const newTracks = data.items.map(item => {
              return {
                song: item.track.name,
                artist: item.track.artists.map(artist => artist.name).join(', '),
                image: item.track?.album?.images[0]?.url,
                uri: item.track.uri
              };
            });
            setTracks(newTracks);
          }
        });
    }
  }

  function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  function getHashParams() {
    const hashParams = {};
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);
    let e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  function handleRedirect(event) {
    event.preventDefault();
    const params = getHashParams();
    const token = params.access_token;
    setToken(token);
    const state = generateRandomString(16);
    const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${scopes}&redirect_uri=${redirect_uri}&state=${state}`;
    window.location = url;
  }

  useEffect(() => {
    const params = getHashParams();
    const token = params.access_token;
    setToken(token);
  }, []);

  useEffect(() => {
    if (token) getAllTracks();
  }, [token]);

  return (
    <div className="App">
      <h1>
        Rock 'n' Roll!{' '}
        <span role="img" aria-label="musical notes">
          🎶
        </span>
      </h1>
      {token ? (
        <React.Fragment>
          <button onClick={generate}>Get new song</button>
          {currentTrack?.image && <img src={currentTrack.image} alt={currentTrack?.song} />}
          <h2>{currentTrack?.song}</h2>
          <h3>{currentTrack?.artist}</h3>
        </React.Fragment>
      ) : (
        <button onClick={event => handleRedirect(event)}>
          <strong>Log in to Spotify</strong>
        </button>
      )}
    </div>
  );
}

export default App;
