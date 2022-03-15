import { MovieCardData } from '../../types'
import MovieCard from '../MovieCard'

interface MovieListProp {
  data: MovieCardData[]
}

const MovieList = ({ data }: MovieListProp) => {
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

export default MovieList
