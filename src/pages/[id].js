import { useState, useEffect, Fragment } from 'react'
import { Tab, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import ReactPlayer from 'react-player/lazy'
import { TMDB_IMG_URL, formatRuntime } from 'utils/urls'

const ScoreIcon = ({ type, score, count }) => {
    const size = 42
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
                    <p className='text-3xl md:text-5xl text-slate-50'>
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
        <div className='rounded-md bg-slate-800'>
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video}`}
                light={true}
                style={{
                    rounded: '6px',
                }}
                controls={true}
            />
        </div>
    )
}

const VideoList = ({ videos }) => {
    return (
        <div
            className='flex flex-row overflow-y-hidden space-x-4
            px-2 pt-2 pb-6 -m-2 overflow-x-scroll scrollbar-hide
            md:scrollbar-default md:scrollbar-thin md:scrollbar-thumb-slate-600
            md:scrollbar-track-transparent md:scrollbar-thumb-rounded-full'
        >
            {videos.map((video) => (
                <VideoThumbnail
                    key={video.id}
                    video={video.key}
                />
            ))}
        </div>
    )
}

const CinemaRow = ({ cinema }) => {
    const cinemaName = cinema.cinema
    const theatre = cinema.theatre
    const timings = cinema.timings
    return (
        <div
            className='flex flex-col gap-y-6
            xl:flex-row xl:gap-y-0 xl:gap-x-24'
        >
            <h3
                className='text-slate-50 capitalize text-2xl
                font-medium xl:w-[256px]'
            >
                <span
                    className='text-gv-yellow
                    uppercase font-moderat_extended'
                >
                    {theatre}
                </span>
                <br />
                {cinemaName.toLowerCase()}
            </h3>
            <div className='hidden xl:flex xl:flex-1'/>
            <div
                className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6
                gap-x-6 gap-y-4'
            >
                {timings.map((timing, i) => (
                    <a
                        key={i}
                        className={timing.status == 'SOLD OUT' ? 'cinemaTimingTextSold' :
                            timing.stauts == 'SELLING FAST' ? 'cinemaTimingTextSelling' :
                            'cinemaTimingTextAvailable'}
                        href={timing.status == 'SOLD OUT' ? '' : timing.url}
                    >
                        {timing.timing.split(' ').slice(1, 3).join(' ').trim()}
                    </a>
                ))}
            </div>
        </div>
    )
}

const DateSelector = ({ cinemasByDate }) => {
    const [selected, setSelected] = useState(cinemasByDate[0])
    return (
        <div className='lg:hidden'>
            <div className="w-full mb-6">
                <Listbox value={selected} onChange={setSelected}>
                    <div className="mt-1">
                        <Listbox.Button
                            className="w-full py-2 pl-3 pr-10 text-left
                            bg-white rounded-lg shadow-md cursor-default focus:outline-none
                            focus-visible:ring-2 focus-visible:ring-opacity-75
                            focus-visible:ring-white focus-visible:ring-offset-orange-300
                            focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
                        >
                            <span className="block truncate">{selected.date}</span>
                            <span
                                className="flex
                                items-center pr-2 pointer-events-none"
                            >
                                <SelectorIcon
                                    className="w-5 h-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                className="w-full py-1 mt-1 overflow-auto
                                text-base bg-white rounded-md shadow-lg max-h-60
                                ring-1 ring-black ring-opacity-5 focus:outline-none
                                sm:text-sm"
                            >
                                {cinemasByDate.map((dateData, i) => (
                                    <Listbox.Option
                                        key={i}
                                        className={({ active }) =>
                                            `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                                            cursor-default select-none py-2 pl-10 pr-4`
                                        }
                                        value={dateData}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`${selected ? 'font-medium' : 'font-normal'
                                                        } block truncate`}
                                                >
                                                    {dateData.date}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`${active ? 'text-amber-600' : 'text-amber-600'
                                                            }
                                                        flex items-center pl-3`}
                                                    >
                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
            <div className='cinemaTimingContainer'>
                {selected.cinemas.map((cinema) => (
                    <CinemaRow
                        key={cinema.cinema}
                        cinema={cinema}
                    />
                ))}
            </div>
        </div>
        
    )
}

const DateTabs = ({ cinemasByDate }) => {
    return (
        <Tab.Group
            vertical
            as='div'
            className='hidden lg:flex lg:flex-col lg:gap-y-8'
        >
            <Tab.List className="flex flex-row">
                {cinemasByDate.map((dateCinema, i) => (
                    <Tab
                        as='div'
                        key={i}
                        className={({ selected }) =>
                            selected ? 'cinemaDateTabSelected' : 'cinemaDateTabUnselected'
                        }
                    >
                        {dateCinema.date}
                    </Tab>
                ))}
            </Tab.List>
            <div className='hidden xl:flex xl:flex-1 bg-red-400'/>
            <Tab.Panels>
                {cinemasByDate.map((dateCinema) => (
                    <Tab.Panel
                        key={dateCinema.date}
                        className='cinemaTimingContainer'
                    >
                        {dateCinema.cinemas.map((cinema) => (
                            <CinemaRow
                                key={cinema.cinema}
                                cinema={cinema}
                            />
                        ))}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    )
}

export default function index({ data }) {
    const movieInfo = data.info
    const genreText = movieInfo.genres.slice(0, 3).map(genre => { return genre.name }).join('/')
    const image_path = movieInfo.backdrop_path || movieInfo.poster_path
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
            cinemas: []
        }
        data.cinemas.map((cinema) => {
            const cinemaDateData = {
                theatre: cinema.theatre,
                cinema: cinema.cinema,
                timings: []
            }
            cinema.timings.map((timing) => {
                if (timing.timing.includes(uniqueDate)) {
                    cinemaDateData['timings'].push(timing)
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

    cinemasByDate.sort((date1, date2) => date1.date > date2.date ? 1 : -1)

    return (
        <main className='font-moderat text-slate-400'>
            <img
                src={`${TMDB_IMG_URL}/${image_path}`}
                alt=''
                className='object-cover w-full h-[384px] lg:h-[512px] xl:h-[798px]'
                loading='lazy'
            />
            <div className='container'>
                {/* Movie title section */}
                <div className='sectionContainer'>
                    <h1 className='titleHeader mb-6'>
                        {movieInfo.title}
                    </h1>
                    <div
                        className='flex flex-col md:flex-row 
                        space-y-1 md:space-y-0 md:space-x-6 px-auto
                        items-center justify-center tracking-wide'
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
                <section className='sectionContainer'>
                    <div
                        className='flex flex-col-reverse xl:flex-row'
                    >
                        <div className='mt-16 lg:mt-24 xl:mt-0 xl:mr-32'>
                            <h2 className='sectionHeader'>
                                Overview
                            </h2>
                            <p className='text-base md:text-lg max-w-2xl'>
                                {movieInfo.overview}
                            </p>
                        </div>
                        {movieInfo.tomatoData.tomatoScore && movieInfo.tomatoData.tomatoScore.score &&
                        <div
                            className='flex flex-col gap-y-8 md:gap-y-0
                            md:flex-row md:gap-x-8 justify-center'
                        >
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
                </section>
                {/* Videos/Trailers section */}
                <section className='sectionContainer'>
                    <h2 className='sectionHeader'>
                        Trailers
                    </h2>
                    <VideoList videos={movieInfo.videos.results} />
                </section>
                <section className='sectionContainer'>
                    {/* Timings section */}
                    <h2 className='sectionHeader'>
                        Timings
                    </h2>
                    {cinemasByDate.length > 0 &&
                    <>
                        <DateSelector cinemasByDate={cinemasByDate} />
                        <DateTabs cinemasByDate={cinemasByDate} />
                    </>}
                </section>
                <section className='sectionContainer'>
                    {/* Reviews section */}
                </section>
            </div>
            
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