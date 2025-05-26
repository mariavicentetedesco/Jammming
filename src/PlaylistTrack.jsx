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
       <div className = "flexbox" id={{id}}>
          <span >{name}</span>
          <span >{albumName}</span>
          <span >{artistName}</span>
          <button onClick={btnClick}>Remove</button>
        </div> 
    </>
  )
}

export default PlaylistTrack
