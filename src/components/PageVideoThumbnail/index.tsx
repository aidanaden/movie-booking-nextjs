import ReactPlayer from 'react-player/lazy'

interface PageVideoThumbnailProps {
  video: string
}

const PageVideoThumbnail = ({ video }: PageVideoThumbnailProps) => {
  return (
    <div className="aspect-video w-full rounded-md">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${video}`}
        light={false}
        style={{
          borderRadius: '6px',
        }}
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  )
}

export default PageVideoThumbnail
