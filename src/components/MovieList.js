import NextImage from 'next/image'
import NextLink from 'next/link'
import { TMDB_IMG_URL, formatRuntime } from 'utils/urls'

const ScoreIcon = ({ type, score, count }) => {
    const size = 40
    if (score) {
        return (
            <div
                className={
                    type == 'audience' ?
                    'flex flex-row space-x-1 items-center' :
                    'flex flex-row space-x-2 items-center'
                }
            >
                <NextImage
                    height={size}
                    width={size}
                    src={type != 'audience' && Number(score) <= 60 ?
                        '/rotten_tomato_rotten.svg' :
                        type != 'audience' && Number(score) < 80 ?
                        '/rotten_tomato_fresh.svg' :
                        type != 'audience' && Number(score) > 80 ?
                        '/rotten_romato_certified.svg' :
                        type == 'audience' && Number(score) <= 50 ?
                        '/rotten_tomato_audience_fail.svg' : 
                        '/rotten_tomato_audience_certified.svg'}
                    alt=''
                />
                <div className='cardRating'>
                    {score}% 
                    <span className='text-base text-slate-500'> ({`${count}`})</span> 
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

const InfoTag = ({ info }) => {
    return (
        <div
            className='infoTag'
        >
            {info}
        </div>
    )
}

const TheatreTag = ({ theatre }) => {
    if (theatre == 'gv') {
        return (
            <div className='cardTheatreTag bg-gv-yellow text-slate-900 font-semibold'>
                gv
            </div>
        )
    } else if (theatre == 'shaw') {
        return (
            <div className='cardTheatreTag bg-shaw-red'>
                shaw
            </div>
        )
    } else if (theatre == 'cathay') {
        return (
            <div className='cardTheatreTag bg-cathay-pink'>
                cathay
            </div>
        )
    } else {
        return <div></div>
    }
    
}

const MovieCard = ({ movie }) => {
    const movieInfo = movie.data.info
    const image_path = movieInfo.backdrop_path || movieInfo.poster_path
    return (
        <NextLink href={`/movies/${movie.slug}`}>
            <a className='flex flex-col'>
                <div className="card min-h-[512px] flex flex-col flex-1">
                    <NextImage
                        height={256}
                        width={256}
                        src={`${TMDB_IMG_URL}/${image_path}`}
                        alt=''
                        className='object-cover w-full h-[256px] rounded-t-md'
                        loading='lazy'
                    />
                    <div className='p-4 pt-4 flex-1 flex flex-col'>
                        <div>
                            <h3 className='cardTitle mb-2'>
                                {movieInfo.title}
                            </h3>
                            <div className='flex flex-row flex-wrap gap-2 mb-4'>
                                {movieInfo.genres.length > 0 &&
                                <InfoTag key={movieInfo.genres[0].id} info={movieInfo.genres[0].name} />}
                                {movieInfo.runtime > 0 &&
                                <InfoTag info={formatRuntime(movieInfo.runtime)} />}
                                {movieInfo.tomatoData.rating &&
                                <InfoTag info={movieInfo.tomatoData.rating} />}
                            </div>
                            <p className='cardOverview'>
                                {movieInfo.overview}
                            </p>
                        </div>
                        <div className='flex-1 flex-grow' />
                        <div className='mt-6 mb-0'>
                            {movieInfo.tomatoData.tomatoScore && movieInfo.tomatoData.tomatoScore.score &&
                            <div className='flex flex-row space-x-4 mb-4 '>
                                <ScoreIcon
                                    type='critic'
                                    score={movieInfo.tomatoData.tomatoScore.score}
                                    count={movieInfo.tomatoData.tomatoScore.count}
                                />
                                <ScoreIcon
                                    type='audience'
                                    score={movieInfo.tomatoData.audienceScore.score}
                                    count={movieInfo.tomatoData.audienceScore.count}
                                />
                            </div>}
                            {movieInfo.theatres && <div className='flex flex-row space-x-2'>
                                {movieInfo.theatres.map((theatre,i) => (
                                    <TheatreTag key={i} theatre={theatre} />
                                ))}
                            </div>}
                        </div>
                    </div>
                </div>
            </a>
        </NextLink>
        
    )
}

export default function MovieList({ data }) {
    data.sort((movie1, movie2) => movie1.data.cinemas.length > movie2.data.cinemas.length ? 1 : -1).reverse()
    return (
        <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
            {data.map((movie) => {
                if (movie.data.cinemas.length > 0)
                    return(
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                        />
                    )
            })}
        </section>
    )
}
