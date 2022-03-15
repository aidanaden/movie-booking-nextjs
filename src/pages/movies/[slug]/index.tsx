import { GetStaticProps, GetStaticPaths } from 'next'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { TMDB_IMG_URL } from '../../../constants'
import { formatRuntime } from '../../../functions/time'
import parse from 'date-fns/parse'

import PageScoreIcon from '../../../components/PageScoreIcon'
import PageVideoThumbnail from '../../../components/PageVideoThumbnail'
import CastList from '../../../components/CastList'
import DateTabs from '../../../components/DateTabs'
import DateSelector from '../../../components/DateSelector'

import { useRouter } from 'next/dist/client/router'

export default function Index({ data }) {
  const router = useRouter()
  const movieInfo = data.info
  const genreText = movieInfo.genres
    .slice(0, 3)
    .map((genre) => {
      return genre.name
    })
    .join('/')
  const image_path = movieInfo.backdrop_path || movieInfo.poster_path
  const trailer_url = movieInfo.videos.results.filter((video) => {
    if (video.type == 'Trailer') return video
  })[0]

  const dates = []
  data.cinemas.map((cinema) => {
    cinema.timings.map((timing) => {
      dates.push(timing.timing.split(' ')[0])
    })
  })
  const uniqueDates = Array.from(new Set(dates))
  const cinemasByDate = []
  uniqueDates.map((uniqueDate) => {
    const dateData = {
      date: uniqueDate,
      cinemas: [],
    }
    data.cinemas.map((cinema) => {
      const cinemaDateData = {
        theatre: cinema.theatre,
        cinema: cinema.cinema,
        timings: [],
      }
      cinema.timings.map((timing) => {
        if (timing.timing.includes(uniqueDate)) {
          const formattedTiming = parse(
            timing.timing.trim(),
            'dd/MM/yyyy hh:mm aa',
            new Date()
          )
          if (formattedTiming.getTime() >= new Date().getTime()) {
            cinemaDateData['timings'].push(timing)
          }
        }
      })
      if (cinemaDateData['timings'].length > 0) {
        dateData['cinemas'].push(cinemaDateData)
      }
    })
    if (dateData['cinemas'].length > 0) {
      cinemasByDate.push(dateData)
    }
  })
  cinemasByDate.sort((date1, date2) =>
    parse(date1.date, 'dd/MM/yyyy', new Date()).getTime() >
    parse(date2.date, 'dd/MM/yyyy', new Date()).getTime()
      ? 1
      : -1
  )

  const castValues = {
    popularCasts: [],
    director: null,
  }
  movieInfo.credits.cast.map((cast) => {
    if (cast.popularity > 5.0) castValues.popularCasts.push(cast)
  })
  movieInfo.credits.crew.map((crew) => {
    if (crew.job == 'Director') castValues.director = crew
  })

  castValues.popularCasts = [
    ...new Map(
      castValues.popularCasts.map((cast) => [cast.name, cast])
    ).values(),
  ]
  castValues.popularCasts
    .sort((cast1, cast2) => (cast1.popularity > cast2.popularity ? 1 : -1))
    .reverse()

  return (
    <main className="font-moderat text-slate-400">
      <img
        src={`${TMDB_IMG_URL}/${image_path}`}
        alt=""
        className="h-[384px] w-full object-cover"
        loading="lazy"
      />
      <div className="container">
        {/* Back to home button */}
        <button
          className="mt-4 flex flex-row
                    items-center justify-center gap-x-1 py-4
                    text-slate-400 hover:text-slate-50 xl:gap-x-2"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon className="h-6 w-6" />
          <span className="lg:text-lg">Home</span>
        </button>
        {/* Movie title section */}
        <div className="sectionContainer">
          <h1 className="titleHeader mb-6">{movieInfo.title}</h1>
          <div
            className="px-auto flex flex-col 
                        items-center justify-center space-y-1 tracking-wide
                        md:flex-row md:space-y-0 md:space-x-3"
          >
            {movieInfo.tomatoData.rating && (
              <p className="infoTag">{movieInfo.tomatoData.rating}</p>
            )}
            {movieInfo.runtime > 0 && (
              <p className="infoTag">{formatRuntime(movieInfo.runtime)}</p>
            )}
            {/* {movieInfo.genres.slice(0, 1).map(genre => (
                            <p className='infoTag' key={genre.id}>
                                {genre.name}
                            </p>
                        ))} */}
            {genreText && <p className="infoTag">{genreText}</p>}
          </div>
        </div>
        {/* Overview section */}
        {movieInfo.overview && (
          <section className="sectionContainer">
            <div className="flex flex-col-reverse xl:flex-row">
              <div>
                <h2 className="sectionHeader">Overview</h2>
                <p className="max-w-2xl text-base md:text-lg">
                  {movieInfo.overview}
                </p>
              </div>
              {movieInfo.tomatoData.tomatoScore &&
                movieInfo.tomatoData.tomatoScore.score && (
                  <div
                    className="mb-16 flex flex-col justify-center
                            gap-y-8 self-center md:flex-row md:gap-y-0
                            md:gap-x-8 lg:mb-24 xl:mx-auto xl:mb-0"
                  >
                    <PageScoreIcon
                      reviewUrl={movieInfo.reviewUrl}
                      type="critic"
                      score={movieInfo.tomatoData.tomatoScore.score}
                      count={movieInfo.tomatoData.tomatoScore.count}
                    />
                    <PageScoreIcon
                      reviewUrl={movieInfo.reviewUrl}
                      type="audience"
                      score={movieInfo.tomatoData.audienceScore.score}
                      count={movieInfo.tomatoData.audienceScore.count}
                    />
                  </div>
                )}
            </div>
          </section>
        )}
        {/* Cast section */}
        {castValues.popularCasts.length > 0 && (
          <section className="sectionContainer">
            <h2 className="sectionHeader">Cast</h2>
            <CastList castValues={castValues} />
          </section>
        )}
        {/* Videos/Trailers section */}
        {movieInfo.videos.results.length > 0 && trailer_url && (
          <section className="sectionContainer">
            <h2 className="sectionHeader">Trailer</h2>
            {/* <VideoList videos={movieInfo.videos.results} /> */}
            <PageVideoThumbnail video={trailer_url.key} />
          </section>
        )}
        {/* Timings section */}
        {cinemasByDate.length > 0 && (
          <section className="sectionContainer">
            <h2 className="sectionHeader">Showtimes</h2>
            <DateSelector cinemasByDate={cinemasByDate} />
            <DateTabs cinemasByDate={cinemasByDate} />
          </section>
        )}
        {/* Reviews section */}
        <section className="sectionContainer"></section>
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  // Return as props
  const movie_res = await fetch(`https://api.showtimesg.com/api/${slug}`)
  const movie = await movie_res.json()

  return {
    props: {
      data: movie.data,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 1, // In seconds
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // retrieve all possible paths
  const movie_res = await fetch(`https://api.showtimesg.com/api/`)
  const movies = await movie_res.json()

  // return to NextJS context
  return {
    paths: movies.map((movie) => ({
      params: {
        slug: `${movie.slug}`,
      },
    })),

    // tells nextjs to show 404 if param not matched
    fallback: false,
  }
}
