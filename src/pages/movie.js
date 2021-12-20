import { TMDB_IMG_URL, formatRuntime } from 'utils/urls'
import NextImage from 'next/image'
// import { data } from 'autoprefixer'

const ScoreIcon = ({ type, score, count }) => {
    const size = 40
    if (score) {
        return (
            <div className='mt-auto'>
                <div
                    className={
                        type == 'audience' ?
                        'flex flex-row space-x-1 justify-center' :
                        'flex flex-row space-x-2 justify-center'
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
                    <p className='text-4xl text-slate-50'>
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

const DetailSection = (props) => {
    return (
        <section className='section container mb-12'>
            {props.children}
        </section>
    )
}

export default function movie() {
    const data = {
        title: 'The Matrix Resurrections',
        backdrop_path: '/3NiiRAKt2L5bUuAvSOkv6Yn7u6T.jpg',
        rating: 'R-21',
        genres: [
            {
                id: 28,
                name: "Action"
            },
            {
                id: 12,
                name: "Adventure"
            },
            {
                id: 878,
                name: "Science Fiction"
            },
        ],
        runtime: 148,
        overview: "Plagued by strange memories, Neo's life takes an unexpected turn when he finds himself back inside the Matrix.",
        tomatoData: {
            rating: "PG",
            tomatoScore: {
                count: "167",
                score: "90"
            },
            audienceScore: {
                count: "2,500+",
                score: "93"
            }
        }
    }
    const genreText = data.genres.slice(0, 3).map(genre => { return genre.name }).join('/')
    return (
        <main className='font-moderat text-slate-400'>
            <img
                src={`${TMDB_IMG_URL}/${data.backdrop_path}`}
                alt=''
                className='object-cover w-full h-[798px]'
                loading='lazy'
            />
            <div className='my-24'>
                <div className='titleHeader mb-6'>
                    {data.title}
                </div>
                <div
                    className='flex flex-row space-x-3
                    px-auto items-center justify-center'
                >
                    <div>
                        {data.rating}
                    </div>
                    <div>
                        {genreText}
                    </div>
                    <div>
                        {formatRuntime(data.runtime)}
                    </div>
                </div>
            </div>
            {/* Overview section */}
            <DetailSection>
                <div className='flex flex-row justify-between'>
                    <div>
                        <div className='sectionHeader'>
                            Overview
                        </div>
                        <p>
                            {data.overview}
                        </p>
                    </div>
                    {data.tomatoData.tomatoScore && data.tomatoData.tomatoScore.score &&
                    <div className='flex flex-row space-x-8'>
                        <ScoreIcon
                            type='critic'
                            score={data.tomatoData.tomatoScore.score}
                            count={data.tomatoData.tomatoScore.count}
                        />
                        <ScoreIcon
                            type='audience'
                            score={data.tomatoData.audienceScore.score}
                            count={data.tomatoData.audienceScore.count}
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