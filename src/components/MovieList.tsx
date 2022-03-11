import NextImage from 'next/image'
import NextLink from 'next/link'
import { TMDB_IMG_URL } from '../constants'
import { formatRuntime } from '../functions/time'

type ScoreIconProps = {
  type: 'critic' | 'audience'
  score: string
  count: string
}

const ScoreIcon = ({ type, score, count }: ScoreIconProps) => {
  const size = 40
  if (score) {
    return (
      <div
        className={
          type == 'audience'
            ? 'flex flex-row items-center space-x-1'
            : 'flex flex-row items-center space-x-2'
        }
      >
        <NextImage
          height={size}
          width={size}
          src={
            type != 'audience' && Number(score) <= 60
              ? '/rotten_tomato_rotten.svg'
              : type != 'audience' && Number(score) < 80
              ? '/rotten_tomato_fresh.svg'
              : type != 'audience' && Number(score) > 80
              ? '/rotten_romato_certified.svg'
              : type == 'audience' && Number(score) <= 50
              ? '/rotten_tomato_audience_fail.svg'
              : '/rotten_tomato_audience_certified.svg'
          }
          alt=""
        />
        <div className="cardRating">
          {score}%
          <span className="text-base text-slate-500"> ({`${count}`})</span>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

type InfoTagProp = {
  info: string
}

const InfoTag = ({ info }: InfoTagProp) => {
  return <div className="infoTag">{info}</div>
}

type TheatreTagProp = {
  theatre: 'gv' | 'shaw' | 'cathay'
}

const TheatreTag = ({ theatre }: TheatreTagProp) => {
  if (theatre == 'gv') {
    return (
      <div className="cardTheatreTag bg-gv-yellow font-semibold text-slate-900">
        gv
      </div>
    )
  } else if (theatre == 'shaw') {
    return <div className="cardTheatreTag bg-shaw-red">shaw</div>
  } else if (theatre == 'cathay') {
    return <div className="cardTheatreTag bg-cathay-pink">cathay</div>
  } else {
    return <div></div>
  }
}

interface MovieData {
  cinemas: any
  info: any
}

interface MovieCard {
  id: number
  slug: string
  data: MovieData
}

type MovieCardProp = {
  movie: MovieCard
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
          />
          <div className="flex flex-1 flex-col p-4 pt-4">
            <div>
              <h3 className="cardTitle mb-2">{movieInfo.title}</h3>
              <div className="mb-4 flex flex-row flex-wrap gap-2">
                {movieInfo.genres.length > 0 && (
                  <InfoTag
                    key={movieInfo.genres[0].id}
                    info={movieInfo.genres[0].name}
                  />
                )}
                {movieInfo.runtime > 0 && (
                  <InfoTag info={formatRuntime(movieInfo.runtime)} />
                )}
                {movieInfo.tomatoData.rating && (
                  <InfoTag info={movieInfo.tomatoData.rating} />
                )}
              </div>
              <p className="cardOverview">{movieInfo.overview}</p>
            </div>
            <div className="flex-1 flex-grow" />
            <div className="mt-6 mb-0">
              {movieInfo.tomatoData.tomatoScore &&
                movieInfo.tomatoData.tomatoScore.score && (
                  <div className="mb-4 flex flex-row space-x-4 ">
                    <ScoreIcon
                      type="critic"
                      score={movieInfo.tomatoData.tomatoScore.score}
                      count={movieInfo.tomatoData.tomatoScore.count}
                    />
                    <ScoreIcon
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

type MovieListProp = {
  data: MovieCard[]
}

export default function MovieList({ data }: MovieListProp) {
  data
    .sort((movie1, movie2) =>
      movie1.data.cinemas.length > movie2.data.cinemas.length ? 1 : -1
    )
    .reverse()
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
      {data.map((movie) => {
        if (movie.data.cinemas.length > 0)
          return <MovieCard key={movie.id} movie={movie} />
      })}
    </section>
  )
}
