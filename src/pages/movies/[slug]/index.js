import { useState, useEffect, Fragment, useRef } from 'react'
import { Tab, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import ReactPlayer from 'react-player/lazy'
import { TMDB_IMG_URL, formatRuntime } from 'utils/urls'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import { useRouter } from 'next/dist/client/router'

const ScoreIcon = ({ reviewUrl, type, score, count }) => {
    const size = 42
    const audienceReviewUrl = `${reviewUrl}?type=verified_audience`
    const criticReviewUrl = `${reviewUrl}?type=top_critics`
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
                    <a
                        className='text-base text-slate-500 mt-0 hover:text-slate-50 hover:underline'
                        href={type != 'audience' ? criticReviewUrl : audienceReviewUrl}
                    >
                        {type != 'audience' ?
                        `${count} reviews` :
                        `${count} verified ratings`}
                    </a>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

const VideoThumbnail = ({ video }) => {
    return (
        <div
            className='rounded-md bg-red-500 w-full aspect-video'
        >
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video}`}
                light={false}
                style={{
                    rounded: '6px'
                }}
                width='100%'
                height='100%'
                controls={true}
            />
        </div>
    )
}

const CastThumbnail = ({ cast }) => {
    return (
        <div
            className='card min-w-[180px] md:min-w-[200px]'
        >
            <img
                src={`${TMDB_IMG_URL}/${cast.profile_path}`}
                alt={`${cast.name} image`}
                className='object-cover h-[256px] w-[256px] rounded-t-md'
                loading='lazy'
            />
            <div className='p-4 pt-4 flex-1 flex flex-col'>
                <div>
                    <h3 className='cardTitle mb-2'>
                        {cast.name}
                    </h3>
                    <p className='cardOverview'>
                        {cast.character ? 
                        <span className='italic'>{cast.character}</span> :
                        cast.job}
                    </p>
                </div>
            </div>
        </div>
    )
}

const CastList = ({ castValues }) => {
    return (
        <div
            className='flex flex-row overflow-y-hidden space-x-4
            px-2 pt-2 pb-6 -m-2 overflow-x-scroll scrollbar-hide
            lg:scrollbar-default lg:scrollbar-thin lg:scrollbar-thumb-slate-600
            lg:scrollbar-track-transparent lg:scrollbar-thumb-rounded-full'
        >   
            {castValues.director != '' &&
            <CastThumbnail
                cast={castValues.director}
            />}
            {castValues.popularCasts.map((cast) => (
                <CastThumbnail
                    key={cast.id}
                    cast={cast}
                />
            ))}
        </div>
    )
}

const formatTimeDisplay = (dateTime) => {
    return dateTime.split(' ').slice(1, 3).join(' ').trim()
}

const CinemaRow = ({ cinema }) => {
    const cinemaName = cinema.cinema
    const theatre = cinema.theatre
    const timings = cinema.timings
    return (
        <div
            className='flex flex-col gap-y-6
            xl:flex-row'
        >
            <h3
                className='text-slate-50 capitalize text-2xl
                font-medium xl:w-[256px] xl:min-h-[6rem]'
            >
                <span
                    className='text-gv-yellow uppercase
                    font-moderat_extended'
                >
                    {theatre}
                </span>
                <br />
                {cinemaName.toLowerCase()}
            </h3>
            <div className='hidden xl:flex xl:flex-1'/>
            <div
                className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6
                gap-x-4 gap-y-4 min-w-max'
            >
                {timings.map((timing, i) => (
                    <a
                        key={i}
                        className={timing.status == 'SOLD OUT' ? 'cinemaTimingTextSold' :
                            timing.status == 'SELLING FAST' ? 'cinemaTimingTextSelling' :
                            'cinemaTimingTextAvailable'}
                        href={timing.status == 'SOLD OUT' ? '' : timing.url}
                    >
                        {formatTimeDisplay(timing.timing)}
                    </a>
                ))}
            </div>
        </div>
    )
}

const formatDateDisplay = (dateText) => {
    const dateParsed = parse(dateText, 'dd/MM/yyyy', new Date())
    return format(dateParsed, 'EEE dd/MM/yyyy')
}

const DateSelector = ({ cinemasByDate }) => {
    const [selected, setSelected] = useState(cinemasByDate[0])
    return (
        <div className='lg:hidden'>
            <div className="sticky top-0 sticky:shadow-lg bg-woodsmoke-900 w-full mb-12">
                <Listbox value={selected} onChange={setSelected}>
                    <div className="mt-1 bg-woodsmoke-900 px-4 py-4 -mx-4">
                        <Listbox.Button
                            className="w-full py-4 px-4 text-left border-2
                            border-slate-800 text-slate-50 rounded-md cursor-default
                            active:bg-slate-600 active:text-slate-400"
                        >
                            <div className='relative text-center text-xl uppercase'>
                                {formatDateDisplay(selected.date)}
                                <span
                                    className="flex absolute right-0 top-0 bottom-0
                                    items-center pr-2 pointer-events-none"
                                >
                                    <SelectorIcon
                                        className="w-6 h-6 text-slate-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </div>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                className="w-full p-2 mt-1 overflow-auto
                                text-xl bg-slate-700 rounded-md flex flex-col
                                gap-y-1 font-medium max-h-72 absolute z-40"
                            >
                                {cinemasByDate.map((dateData, i) => (
                                    <Listbox.Option
                                        key={i}
                                        className={({ active }) =>
                                            `${active ? 'text-slate-800 bg-slate-200' : 'text-slate-400'}
                                            cursor-default select-none py-2 px-3 flex flex-row text-center
                                            relative rounded-md justify-center uppercase`
                                        }
                                        value={dateData}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span>
                                                    {formatDateDisplay(dateData.date)}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`${active ? 'text-slate-800' : 'text-slate-800'
                                                            }
                                                            flex absolute right-0 top-0 bottom-0
                                                            items-center pr-2 pointer-events-none`}
                                                    >
                                                        <CheckIcon className="w-6 h-6" aria-hidden="true" />
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

SwiperCore.use([Navigation])

const useSwiperRef = () => {
    const [wrapper, setWrapper] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        setWrapper(ref.current);
    }, []);

    return [
        wrapper,
        ref
    ]
}

function DateSwiper(props) {
    const [nextEl, nextElRef] = useSwiperRef();
    const [prevEl, prevElRef] = useSwiperRef();
    return (
        <>
            <div
                ref={prevElRef}
                className='cinemaDateSwiperLeft'
            >
                <ChevronLeftIcon className="w-8 h-8" aria-hidden="true" />
            </div>
            <Swiper
                slidesPerView={props.slidesPerView}
                spaceBetween={30}
                navigation={{
                    prevEl,
                    nextEl
                }}
            >
                {props.children}
            </Swiper>
            <div
                ref={nextElRef}
                className='cinemaDateSwiperRight'
            >
                <ChevronRightIcon className="w-8 h-8" aria-hidden="true" />
            </div>
        </>
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
                <DateSwiper slidesPerView={Math.min(cinemasByDate.length, 5)}>
                    {cinemasByDate.map((dateCinema, i) => (
                        <SwiperSlide>
                            <Tab
                                as='div'
                                key={i}
                                className={({ selected }) =>
                                    selected ? 'cinemaDateTabSelected' : 'cinemaDateTabUnselected'
                                }
                            >
                                {formatDateDisplay(dateCinema.date)}
                            </Tab>
                        </SwiperSlide>
                    ))}
                </DateSwiper>
            </Tab.List>
            <div className='hidden xl:flex xl:flex-1'/>
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
    const router = useRouter()
    const movieInfo = data.info
    const genreText = movieInfo.genres.slice(0, 3).map(genre => { return genre.name }).join('/')
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
                    const formattedTiming = parse(timing.timing.trim(), 'dd/MM/yyyy hh:mm aa', new Date())
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
    cinemasByDate.sort((date1, date2) => date1.date > date2.date ? 1 : -1)

    const castValues = {
        popularCasts: [],
        director: ''
    }
    movieInfo.credits.cast.map((cast) => {
        if (cast.popularity > 5.0)
            castValues.popularCasts.push(cast)
    })
    movieInfo.credits.crew.map((crew) => {
        if (crew.job == 'Director')
            castValues.director = crew
    })
    
    castValues.popularCasts = [...new Map(castValues.popularCasts.map(cast => [cast.name, cast])).values()];
    castValues.popularCasts.sort((cast1, cast2) => cast1.popularity > cast2.popularity ? 1 : -1).reverse()

    return (
        <main className='font-moderat text-slate-400'>
            <img
                src={`${TMDB_IMG_URL}/${image_path}`}
                alt=''
                className='object-cover w-full h-[384px] lg:h-[512px] xl:h-[798px]'
                loading='lazy'
            />
            <div className='container'>
                {/* Back to home button */}
                <button
                    className='py-4 items-center justify-center
                    mt-4 flex flex-row gap-x-1 xl:gap-x-2 text-slate-400
                    hover:text-slate-50'
                    onClick={() => router.back()}
                >
                    <ChevronLeftIcon
                        className='w-6 h-6'
                    />
                    <span className='lg:text-lg'>
                        Home
                    </span>
                </button>
                {/* Movie title section */}
                <div className='sectionContainer'>
                    <h1 className='titleHeader mb-6'>
                        {movieInfo.title}
                    </h1>
                    <div
                        className='flex flex-col md:flex-row 
                        space-y-1 md:space-y-0 md:space-x-3 px-auto
                        items-center justify-center tracking-wide'
                    >
                        {movieInfo.tomatoData.rating && 
                        <p className='infoTag'>
                            {movieInfo.tomatoData.rating}
                        </p>}
                        {movieInfo.runtime > 0 &&
                        <p className='infoTag'>
                            {formatRuntime(movieInfo.runtime)}
                        </p>}
                        {/* {movieInfo.genres.slice(0, 1).map(genre => (
                            <p className='infoTag' key={genre.id}>
                                {genre.name}
                            </p>
                        ))} */}
                        {genreText &&
                        <p className='infoTag'>
                            {genreText}
                        </p>}
                    </div>
                </div>
                {/* Overview section */}
                {movieInfo.overview &&
                <section className='sectionContainer'>
                    <div
                        className='flex flex-col-reverse xl:flex-row'
                    >
                        <div>
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
                            md:flex-row md:gap-x-8 justify-center
                            mb-16 lg:mb-24 xl:mb-0 xl:ml-32'
                        >
                            <ScoreIcon
                                reviewUrl={movieInfo.reviewUrl}
                                type='critic'
                                score={movieInfo.tomatoData.tomatoScore.score}
                                count={movieInfo.tomatoData.tomatoScore.count}
                            />
                            <ScoreIcon
                                reviewUrl={movieInfo.reviewUrl}
                                type='audience'
                                score={movieInfo.tomatoData.audienceScore.score}
                                count={movieInfo.tomatoData.audienceScore.count}
                            />
                        </div>}
                    </div>
                </section>}
                {/* Cast section */}
                {castValues.popularCasts.length > 0 &&
                <section className='sectionContainer'>
                    <h2 className='sectionHeader'>
                        Cast
                    </h2>
                    <CastList
                        castValues={castValues}
                    />
                </section>}
                {/* Videos/Trailers section */}
                {movieInfo.videos.results.length > 0 && trailer_url &&
                <section className='sectionContainer'>
                    <h2 className='sectionHeader'>
                        Trailer
                    </h2>
                    {/* <VideoList videos={movieInfo.videos.results} /> */}
                    <VideoThumbnail
                        video={trailer_url.key}
                    />
                </section>}
                {/* Timings section */}
                {cinemasByDate.length > 0 &&
                <section className='sectionContainer'>
                    <h2 className='sectionHeader'>
                        Showtimes
                    </h2>
                    <DateSelector cinemasByDate={cinemasByDate} />
                    <DateTabs cinemasByDate={cinemasByDate} />
                </section>}
                {/* Reviews section */}
                <section className='sectionContainer'>
                    
                </section>
            </div>
            
        </main>
    )
}


export async function getStaticProps({ params: { slug } }) {
    // Return as props
    const movie_res = await fetch(`http://128.199.142.207:8000/api/${slug}`)
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
                slug: `${movie.slug}`
            }
        })),

        // tells nextjs to show 404 if param not matched
        fallback: false
    }
}