import './PlaylistTrack.css'

const PlaylistTrack = (props) => {
  const albumName = props.albumName;
  const name = props.name;
  const artistName = props.artistName;
  const id = props.id;
  const removeSong = props.removeSong;

  const  btnClick = function(event){
     removeSong(id);
  }

  return (
    <>
       <div id={{id}} style={{display:"flex"}}>
          <span style={{display:"flex"}}>{name}</span>
          <span style={{display:"flex"}}>{albumName}</span>
          <span style={{display:"flex"}}>{artistName}</span>
          <button onClick={btnClick}>Remove</button>
        </div> 
    </>
  )
}

export default PlaylistTrack
