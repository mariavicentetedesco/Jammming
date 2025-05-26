import { useState } from 'react'
import './App.css'
import Authentication  from './authentication'
import Track from './Track'
import Artist from './Artist'
import PlaylistTrack from './PlaylistTrack'

function App() {
  const [displayingTracks, setDisplayingTracks] = useState([]);
  const [displayingArtist, setDisplayingArtist] = useState([]);
  const [displayingPlaylistTracks, setDisplayingPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistId, setPlaylistId] = useState('');

  const spotifyBaseURI = 'https://api.spotify.com/v1';
  let accessToken = '';
  accessToken= localStorage.getItem('access_token');
  if(accessToken === null || accessToken === 'undefined') {
    Authentication.initiateAuthentication();
  }

  const addSong = function (name, id, artist, album, uri) {
     setDisplayingPlaylistTracks([...displayingPlaylistTracks, {name,id,key:id,artist, album, uri}]);
    let currentResults = displayingTracks;
    currentResults = currentResults.filter(x => x.id !== id);
    setDisplayingTracks(currentResults);
  }

  const removeSong = function (id) {
    let currentTracks = displayingPlaylistTracks;
    currentTracks =  currentTracks.filter(x => x.id !== id);
    setDisplayingPlaylistTracks(currentTracks);
  }

  const searchSong = function (event) {
    setDisplayingArtist([]);
    let searchInput = document.getElementById('searchText');
    getSongsfromSpotify(searchInput.value);
    document.getElementById('playlist').classList.add("shown");
  }

  const searchArtist = function(event) {
    setDisplayingTracks([]);
    let searchInput = document.getElementById('searchText');
    getArtistFromSpotify(searchInput.value);
    document.getElementById('playlist').classList.add("shown");
  }

  const getArtistTopTracks = function(id) {
    setDisplayingArtist([]);
    const getTopTracksURL = `${spotifyBaseURI}/artists/${id}/top-tracks`;
    fetch(getTopTracksURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json()).then(data => {
      if(data.error !== undefined && data.error.status === 401) {
        localStorage.removeItem('access_token');
        Authentication.initiateAuthentication();
        return;
      }
      let tracks = data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }))
      setDisplayingTracks(tracks);
    })
  }

    const postPlaylistToSpotify = function() {
      const userId = localStorage.getItem('user_id');
      const createPlaylistURL = `${spotifyBaseURI}/users/${userId}/playlists`;

      let playlistName = document.getElementById('playlistName').value;
      
      let postBody = {
        name: playlistName,
        public: false
      };

      fetch(createPlaylistURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(postBody)
      }).then(response => 
        {
          return response.json();
        })
        .then(data => {
        if(data.error !== undefined && data.error.status === 401) {
          localStorage.removeItem('access_token');
          Authentication.initiateAuthentication();
          return;
        }
        setPlaylistId(data.id);
        setPlaylistName(data.name);
        
        let addSongsToPlaylistURL = `${spotifyBaseURI}/playlists/${data.id}/tracks`;
        let songsURIs = displayingPlaylistTracks.map(x => x.uri)

        let addSongsBody = {
        uris: songsURIs,
        };

        fetch(addSongsToPlaylistURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`
         },
         body: JSON.stringify(addSongsBody)
        }).then(response => 
          {
          return response.json();
          })
          .then(data => {
          if(data.error !== undefined && data.error.status === 401) {
          localStorage.removeItem('access_token');
          Authentication.initiateAuthentication();
          return;
          }
        })
      }) 
  }

  const postUpadatedPlaylistToSpotify = function() {
    const updatePlaylistURL = `${spotifyBaseURI}/playlists/${playlistId}`;

      let newPlaylistName = document.getElementById('playlistName').value;
      
      let putBody = {
        name: newPlaylistName,
        public: false
      };

      fetch(updatePlaylistURL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(putBody)
      })
        .then(response => {
       
        setPlaylistName(newPlaylistName);
        
        let addSongsToPlaylistURL = `${spotifyBaseURI}/playlists/${playlistId}/tracks`;
        let songsURIs = displayingPlaylistTracks.map(x => x.uri)

        let addSongsBody = {
        uris: songsURIs,
        };

        fetch(addSongsToPlaylistURL, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`
         },
         body: JSON.stringify(addSongsBody)
        }).then(response => 
          {
          return response.json();
          })
          .then(data => {
          if(data.error !== undefined && data.error.status === 401) {
          localStorage.removeItem('access_token');
          Authentication.initiateAuthentication();
          return;
          }
        })
      }) 
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
      })).filter(result => {
        return !displayingPlaylistTracks.map(playlistTrack => playlistTrack.id).includes(result.id)
      });
      setDisplayingTracks(tracks);
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
          <button onClick={searchArtist}>Search Artist
          </button>
        </div>
        <div className='main'>
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
            uri={track.uri}
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
            getArtistTopTracks={getArtistTopTracks}
            />
          );
          })}
          </div>
          <div id="playlist">
          <h3>Playlist: {playlistName} </h3>
           {displayingPlaylistTracks.map((track,i) => {
        return (
          <PlaylistTrack
          id={track.id}
          removeSong={removeSong}
          name={track.name}
          albumName={track.album}
          key={`${track.id}_${i}`}
          artistName={track.artist}
          />
        );
        })}
          <input id="playlistName" placeholder='Playlist name'></input>
          <button onClick={postPlaylistToSpotify}>Create Playlist</button>
          <button onClick={postUpadatedPlaylistToSpotify}>Update Playlist</button>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
