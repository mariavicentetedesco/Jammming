import './Album.css'

const Album = (props) => {
  const image = props.image;
  const name = props.name;
  const artist = props.artist;
  const id = props.id;
  const link = props.href;

  return (
    <>
       <div id={{id}} style={{display:"flex"}}>
          <span>
            <a href={link}><img src={image}/></a>
          </span>
          <span>Album: {name}</span>
          <span>Artist: {artist}</span>
        </div> 
    </>
  )
}

export default Album
