import { TMDB_IMG_URL, formatRuntime } from 'utils/urls'

const DetailSection = (props) => {
    return (
        <section className='section container mb-12'>
            {props.children}
        </section>
    )
}

const ScoreIcon = ({ type, score, count }) => {
    const size = 48
    if (score) {
        return (
            <div className='mt-auto'>
                <div
                    className={
                        type == 'audience' ?
                        'flex flex-row space-x-2 justify-center' :
                        'flex flex-row space-x-3 justify-center'
                    }
                >
                    <img
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
                    <p className='text-5xl text-slate-50'>
                        {score}%
                    </p>
                </div>
                <div className='mt-3 text-center'>
                    <h3 className='text-lg text-slate-200 capitalize'>
                        {type != 'audience' ?
                        `Tomatometer` :
                        `Audience score`}
                    </h3>
                    <p className='text-base text-slate-500 mt-0'>
                        {type != 'audience' ?
                        `${count} reviews` :
                        `${count} verified ratings`}
                    </p> 
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

const VideoThumbnail = ({ video }) => {
    return (
        <div className='rounded-md'>

        </div>
    )
}

const VideoList = ({ videos }) => {
    return (
        <div
            className='flex flex-row overflow-y-hidden
            px-2 pt-2 pb-6 -m-2 overflow-x-scroll scrollbar-hide
            md:scrollbar-default md:scrollbar-thin md:scrollbar-thumb-slate-600
            md:scrollbar-track-transparent md:scrollbar-thumb-rounded-full'
        >
            {videos.map((video, i) => (
                <VideoThumbnail
                    key={i}
                    video={video}
                />
            ))}
        </div>
    )
}

export default function index({ data }) {
    const movieInfo = data.info
    const genreText = movieInfo.genres.slice(0, 3).map(genre => { return genre.name }).join('/')
    const image_path = movieInfo.backdrop_path || movieInfo.poster_path
    return (
        <main className='font-moderat text-slate-400'>
            <img
                src={`${TMDB_IMG_URL}/${image_path}`}
                alt=''
                className='object-cover w-full h-[798px]'
                loading='lazy'
            />
            <div className='my-24'>
                <div className='titleHeader mb-6'>
                    {movieInfo.title}
                </div>
                <div
                    className='flex flex-row space-x-4
                    px-auto items-center justify-center
                    tracking-wide'
                >
                    {movieInfo.tomatoData && 
                    <p>
                        {movieInfo.tomatoData.rating}
                    </p>}
                    <p>
                        {genreText}
                    </p>
                    <p className='uppercase'>
                        {formatRuntime(movieInfo.runtime)}
                    </p>
                </div>
            </div>
            {/* Overview section */}
            <DetailSection>
                <div className='flex flex-row justify-between'>
                    <div>
                        <div className='sectionHeader'>
                            Overview
                        </div>
                        <p className='text-lg max-w-2xl'>
                            {movieInfo.overview}
                        </p>
                    </div>
                    {movieInfo.tomatoData.tomatoScore && movieInfo.tomatoData.tomatoScore.score &&
                    <div className='flex flex-row space-x-8'>
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
                </div>
            </DetailSection>
            {/* Videos/Trailers section */}
            <DetailSection>
                {/* https://www.youtube.com/watch?v= */}
                <div className='sectionHeader'>
                    Trailers
                </div>
                {/* <VideoList
                    videos={}
                /> */}
            </DetailSection>
            <DetailSection>
                {/* Timings section */}
            </DetailSection>
            <DetailSection>
                {/* Reviews section */}
            </DetailSection>
        </main>
    )
}


export async function getStaticProps({ params: { id } }) {
    // Return as props
    const movie_res = await fetch(`http://128.199.142.207:8000/api/${id}`)
    const movie = await movie_res.json()

    return {
        props: {
            data: movie.data
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 1, // In seconds
    }
}

export async function getStaticPaths() {
    // retrieve all possible paths
    const movie_res = await fetch(`http://128.199.142.207:8000/api/`)
    const movies = await movie_res.json()
    
    // return to NextJS context
    return {
        paths: movies.map(movie => ({
            params: { 
                id: `${movie.id}`
            }
        })),

        // tells nextjs to show 404 if param not matched
        fallback: false 
    }
}