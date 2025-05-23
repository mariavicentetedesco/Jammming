import './Album.css'

const Artist = (props) => {
  const name = props.name;
  const id = props.id;
  const href = props.href;
  const image = props.image;

  return (
    <>
       <div id={{id}} style={{display:"flex"}}>
           <span>
            <img src={image} />
          </span>
          <span>Artist: <a href={href}> {name}</a></span>
        </div> 
    </>
  )
}

export default Artist