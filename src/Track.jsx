const Track = (props) => {
  const albumName = props.albumName;
  const name = props.name;
  const artistName = props.artistName;
  const id = props.id;
  const addSong = props.addSong;

  const  btnClick = function(event){
     addSong(name,id);
  }

  return (
    <>
       <div id={{id}} style={{display:"flex"}}>
          <span style={{display:"flex"}}>{name}</span>
          <span style={{display:"flex"}}>{albumName}</span>
          <span style={{display:"flex"}}>{artistName}</span>
          <button onClick={btnClick}>Add</button>
        </div> 
    </>
  )
}

export default Track
