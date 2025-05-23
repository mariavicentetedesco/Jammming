import { useState } from 'react'
import './App.css'
import Authentication  from './authentication'
import Track from './Track'
import Album from './Album'
import Artist from './Artist'

function App() {
  const [displayingTracks, setDisplayingTracks] = useState([]);
  const [displayingAlbums, setDisplayingAlbums] = useState([]);
  const [displayingArtist, setDisplayingArtist] = useState([]);
  const [displayingPlaylistTracks, setDisplayingPlaylistTracks] = useState([]);

  const spotifyBaseURI = 'https://api.spotify.com/v1';
  let accessToken = '';
  accessToken= localStorage.getItem('access_token');
  if(accessToken === null || accessToken === 'undefined') {
    Authentication.initiateAuthentication();
  }

  const addSong = function (name, id) {
     setDisplayingPlaylistTracks([...displayingPlaylistTracks, {name,id,key:id}]);
  }

  const removeSong = function (name, id) {
    
  }

  const searchSong = function (event) {
    setDisplayingAlbums([]);
    setDisplayingArtist([]);
    let searchInput = document.getElementById('searchText');
    getSongsfromSpotify(searchInput.value);
  }

  const searchAlbum = (event) => {
    setDisplayingTracks([])
    setDisplayingArtist([])
    let searchInput = document.getElementById('searchText')
    getAlbumfromSpotify(searchInput.value)
  }

  const searchArtist = function(event) {
    setDisplayingTracks([]);
    setDisplayingAlbums([]);
    let searchInput = document.getElementById('searchText');
    getArtistFromSpotify(searchInput.value);
  }
  

  const getSongsfromSpotify = function(songTitle) {
    const getTrackURL = `${spotifyBaseURI}/search?q=${songTitle}&type=track&limit10`;
    fetch(getTrackURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json()).then(data => {
      if(data.error !== undefined && data.error.status === 401) {
        localStorage.removeItem('access_token');
        Authentication.initiateAuthentication();
        return;
      }
      let tracks = data.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }))
      setDisplayingTracks(tracks);
    })
  }

  const getAlbumfromSpotify = function(albumTitle) {
    const getAlbumURL = `${spotifyBaseURI}/search?q=${albumTitle}&type=album&limit=5`;
    fetch(getAlbumURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json()).then(data => {
      if(data.error !== undefined && data.error.status === 401) {
        localStorage.removeItem('access_token');
        Authentication.initiateAuthentication();
        return;
      }
      let albums = data.albums.items.map(album => ({
        id: album.id,
        image: album.images[0].url,
        name: album.name,
        artist: album.artists[0].name,
        href: album.href
      }))
      setDisplayingAlbums(albums);
    })
  }

  const getArtistFromSpotify = function(artistName) {
    const getArtistURL = `${spotifyBaseURI}/search?q=${artistName}&type=artist&limit=5`;
    fetch(getArtistURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json()).then(data => {
      let artist = data.artists.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url,
        href: artist.href,
        uri: artist.uri
      }))
      setDisplayingArtist(artist);
    })
  }


  return (
    <>

      <h1>Jammming</h1>
      <input type='text' id='searchText' placeholder='Search song or album'></input>
      <div className="card">
        <div id="buttons">
          <button onClick={searchSong}>Search Song
          </button>
          <button onClick={searchAlbum}>Search Album
          </button>
          <button onClick={searchArtist}>Search Artist
          </button>
        </div>
        <div id='results'>
        {displayingTracks.map((track) => {
        return (
          <Track
          id={track.id}
          addSong={addSong}
          name={track.name}
          albumName={track.album}
          key={track.id}
          artistName={track.artist}
          />
        );
        })}
        {displayingAlbums.map((album) => {
        return (
          <Album
          id={album.id}
          name={album.name}
          artist={album.artist}
          key={album.id}
          image={album.image}
          />
        );
        })}
        {displayingArtist.map((artist) => {
        return (
          <Artist
          id={artist.id}
          name={artist.name}
          href={artist.href}
          key={artist.id}
          image={artist.image}
          />
        );
        })}
        </div>
        <div id="playlist">
          <h3>Playlist:</h3>
           {displayingPlaylistTracks.map((track) => {
        return (
        <> 
          <div key={track.key}>{track.name}</div>
          <div key={track.artist}>{track.artist}</div>
          <button id="remove">Remove</button>
        </> 
        );
        })}
        </div>
      </div>
    </>
  )
}

export default App
