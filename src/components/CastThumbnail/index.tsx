import NextImage from 'next/image'
import { Cast } from '../../types'

import { TMDB_IMG_URL } from '../../constants'

interface CastThumbnailProp {
  cast: Cast
}

const CastThumbnail = ({ cast }: CastThumbnailProp) => {
  return (
    <div className="card min-w-[180px] md:min-w-[200px]">
      <NextImage
        height={256}
        width={256}
        src={`${TMDB_IMG_URL}/${cast.profile_path}`}
        alt={`${cast.name} image`}
        className="rounded-t-md object-cover"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col p-4 pt-4">
        <div>
          <h3 className="cardTitle mb-2">{cast.name}</h3>
          <p className="cardOverview">
            {cast.character ? (
              <span className="italic">{cast.character}</span>
            ) : (
              cast.job
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CastThumbnail
