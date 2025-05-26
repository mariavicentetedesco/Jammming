import './Artist.css'

const Artist = (props) => {
  const name = props.name;
  const id = props.id;
  const image = props.image;
  const getArtistTopTracks = props.getArtistTopTracks;

  const  btnClick = function(event){
    getArtistTopTracks(id);
  }

  return (
    <>
       <div className='flexbox' id={{id}} style={{display:"flex"}}>
           <span className='artistImg'>
            <img src={image} />
          </span>
          <span className='artistName'>Artist: <a onClick={btnClick}> {name}</a></span>
        </div> 
    </>
  )
}

export default Artist