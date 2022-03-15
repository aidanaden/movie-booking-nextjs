import NextImage from 'next/image'
import NextLink from 'next/link'
import HomeScoreIcon from '../HomeScoreIcon'
import TheatreTag from '../TheatreTag'
import InfoTag from '../InfoTag'

import { MovieCardData } from '../../types'
import { TMDB_IMG_URL } from '../../constants'
import { formatRuntime } from '../../functions/time'

interface MovieCardProp {
  movie: MovieCardData
}

const MovieCard = ({ movie }: MovieCardProp) => {
  const movieInfo = movie.data.info
  const image_path = movieInfo.backdrop_path || movieInfo.poster_path
  return (
    <NextLink href={`/movies/${movie.slug}`}>
      <a className="flex flex-col">
        <div className="card flex min-h-[512px] flex-1 flex-col">
          <NextImage
            height={256}
            width={256}
            src={`${TMDB_IMG_URL}/${image_path}`}
            alt=""
            className="h-[256px] w-full rounded-t-md object-cover"
            loading="lazy"
            quality="85"
          />
          <div className="flex flex-1 flex-col p-4 pt-4">
            <div>
              <h3 className="cardTitle mb-2">{movieInfo.title}</h3>
              <div className="mb-4 flex flex-row flex-wrap gap-2">
                {movieInfo.genres.length > 0 && (
                  <InfoTag key={movieInfo.genres[0].id}>
                    {movieInfo.genres[0].name}
                  </InfoTag>
                )}
                {movieInfo.runtime > 0 && (
                  <InfoTag>{formatRuntime(movieInfo.runtime)}</InfoTag>
                )}
                {movieInfo.tomatoData.rating && (
                  <InfoTag>{movieInfo.tomatoData.rating}</InfoTag>
                )}
              </div>
              <p className="cardOverview">{movieInfo.overview}</p>
            </div>
            <div className="flex-1 flex-grow" />
            <div className="mt-6 mb-0">
              {movieInfo.tomatoData.tomatoScore &&
                movieInfo.tomatoData.tomatoScore.score && (
                  <div className="mb-4 flex flex-row space-x-4 ">
                    <HomeScoreIcon
                      type="critic"
                      score={movieInfo.tomatoData.tomatoScore.score}
                      count={movieInfo.tomatoData.tomatoScore.count}
                    />
                    <HomeScoreIcon
                      type="audience"
                      score={movieInfo.tomatoData.audienceScore.score}
                      count={movieInfo.tomatoData.audienceScore.count}
                    />
                  </div>
                )}
              {movieInfo.theatres && (
                <div className="flex flex-row space-x-2">
                  {movieInfo.theatres.map((theatre, i) => (
                    <TheatreTag key={i} theatre={theatre} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </NextLink>
  )
}

export default MovieCard
