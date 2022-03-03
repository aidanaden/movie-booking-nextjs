import { GetStaticProps, GetStaticPaths } from 'next'
import { useState, useEffect, Fragment, useRef } from 'react'
import { Tab, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import ReactPlayer from 'react-player/lazy'
import { TMDB_IMG_URL, formatRuntime } from '../../../utils/urls'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import NextImage from 'next/image'

import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import { useRouter } from 'next/dist/client/router'

type ScoreIconProps = {
    reviewUrl: string
    type: 'critic' | 'audience'
    score: string
    count: string
}

const ScoreIcon = ({ reviewUrl, type, score, count }: ScoreIconProps) => {
    const size = 42
    const audienceReviewUrl = `${reviewUrl}?type=verified_audience`
    const criticReviewUrl = `${reviewUrl}?type=top_critics`
    if (score) {
        return (
            <div className="mt-auto">
                <div
                    className={
                        type == 'audience'
                            ? 'flex flex-row justify-center space-x-2'
                            : 'flex flex-row justify-center space-x-3'
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
                    <p className="text-3xl text-slate-50 md:text-5xl">
                        {score}%
                    </p>
                </div>
                <div className="mt-3 text-center">
                    <h3 className="text-lg capitalize text-slate-200">
                        {type != 'audience' ? `Tomatometer` : `Audience score`}
                    </h3>
                    <a
                        className="mt-0 text-base text-slate-500 hover:text-slate-50 hover:underline"
                        href={
                            type != 'audience'
                                ? criticReviewUrl
                                : audienceReviewUrl
                        }
                    >
                        {type != 'audience'
                            ? `${count} reviews`
                            : `${count} verified ratings`}
                    </a>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

type VideoThumbnailProps = {
    video: string
}

const VideoThumbnail = ({ video }: VideoThumbnailProps) => {
    return (
        <div className="aspect-video w-full rounded-md">
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video}`}
                light={false}
                style={{
                    rounded: '6px',
                }}
                width="100%"
                height="100%"
                controls={true}
            />
        </div>
    )
}

type Cast = {
    id: number
    name: string
    profile_path: string
    character: string
    job: string
}

type CastThumbnailProp = {
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

type CastValues = {
    popularCasts: Cast[]
    director: Cast
}

type CastListProp = {
    castValues: CastValues
}

const CastList = ({ castValues }: CastListProp) => {
    return (
        <div
            className="lg:scrollbar-thumb-rounded-full -m-2 flex flex-row
            space-x-4 overflow-x-scroll px-2 pt-2 pb-6 scrollbar-hide
            overflow-y-hidden lg:scrollbar-default lg:scrollbar-thin
            lg:scrollbar-track-transparent lg:scrollbar-thumb-slate-600"
        >
            {castValues.director != null && (
                <CastThumbnail cast={castValues.director} />
            )}
            {castValues.popularCasts.map((cast) => (
                <CastThumbnail key={cast.id} cast={cast} />
            ))}
        </div>
    )
}

const formatTimeDisplay = (dateTime: string) => {
    return dateTime.split(' ').slice(1, 3).join(' ').trim()
}

type Timing = {
    url: string
    status: 'AVAILABLE' | 'SELLING FAST' | 'SOLD OUT'
    timing: string
}

type Cinema = {
    cinema: string
    theatre: 'gv' | 'shaw' | 'Cathay'
    timings: Timing[]
}

type CinemaRowProp = {
    cinema: Cinema
}

const CinemaRow = ({ cinema }: CinemaRowProp) => {
    const cinemaName = cinema.cinema
    const theatre = cinema.theatre
    const timings = cinema.timings
    return (
        <div className="flex flex-col gap-y-6 xl:flex-row">
            <h3
                className="text-2xl font-medium capitalize
                text-slate-50 xl:min-h-[6rem] xl:w-[256px]"
            >
                <span
                    className={`cinemaTheatreTitle
                    ${
                        theatre == 'shaw'
                            ? 'text-shaw-red'
                            : theatre == 'gv'
                            ? 'text-gv-yellow'
                            : 'text-cathay-pink'
                    }`}
                >
                    {theatre}
                </span>
                <br />
                {cinemaName.toLowerCase()}
            </h3>
            <div className="hidden xl:flex xl:flex-1" />
            <div
                className="grid min-w-max grid-cols-2 gap-x-4
                gap-y-4 md:grid-cols-4 lg:grid-cols-6"
            >
                {timings.map((timing, i) => (
                    <a
                        key={i}
                        className={
                            timing.status == 'SOLD OUT'
                                ? 'cinemaTimingTextSold'
                                : timing.status == 'SELLING FAST'
                                ? 'cinemaTimingTextSelling'
                                : 'cinemaTimingTextAvailable'
                        }
                        href={timing.status == 'SOLD OUT' ? '' : timing.url}
                    >
                        {formatTimeDisplay(timing.timing)}
                    </a>
                ))}
            </div>
        </div>
    )
}

const formatDateDisplay = (dateText: string) => {
    const dateParsed = parse(dateText, 'dd/MM/yyyy', new Date())
    return format(dateParsed, 'EEE dd/MM/yyyy')
}

const DateSelector = ({ cinemasByDate }) => {
    const [selected, setSelected] = useState(cinemasByDate[0])
    return (
        <div className="lg:hidden">
            <div className="sticky:shadow-lg sticky top-0 mb-12 w-full bg-woodsmoke-900">
                <Listbox value={selected} onChange={setSelected}>
                    <div className="-mx-4 mt-1 bg-woodsmoke-900 px-4 py-4">
                        <Listbox.Button
                            className="w-full cursor-default rounded-md border-2 border-slate-800
            py-4 px-4 text-left text-slate-50 active:bg-slate-600 active:text-slate-400"
                        >
                            <div className="relative text-center text-xl uppercase">
                                {formatDateDisplay(selected.date)}
                                <span
                                    className="pointer-events-none absolute right-0 top-0
                bottom-0 flex items-center pr-2"
                                >
                                    <SelectorIcon
                                        className="h-6 w-6 text-slate-400"
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
                                className="absolute z-40 mt-1 flex
                                max-h-72 w-full flex-col gap-y-1 overflow-auto
                                rounded-md bg-slate-700 p-2 text-xl font-medium"
                            >
                                {cinemasByDate.map((dateData, i) => (
                                    <Listbox.Option
                                        key={i}
                                        className={({ active }) =>
                                            `${
                                                active
                                                    ? 'bg-slate-200 text-slate-800'
                                                    : 'text-slate-400'
                                            }
                      relative flex cursor-default select-none flex-row justify-center
                      rounded-md px-3 py-2 text-center uppercase`
                                        }
                                        value={dateData}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span>
                                                    {formatDateDisplay(
                                                        dateData.date
                                                    )}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`${
                                                            active
                                                                ? 'text-slate-800'
                                                                : 'text-slate-800'
                                                        }
                                                            pointer-events-none absolute right-0 top-0 bottom-0
                                                            flex items-center pr-2`}
                                                    >
                                                        <CheckIcon
                                                            className="h-6 w-6"
                                                            aria-hidden="true"
                                                        />
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
            <div className="cinemaTimingContainer">
                {selected.cinemas.map((cinema) => (
                    <CinemaRow key={cinema.cinema} cinema={cinema} />
                ))}
            </div>
        </div>
    )
}

SwiperCore.use([Navigation])

const useSwiperRef = () => {
    const [wrapper, setWrapper] = useState(null)
    const ref = useRef(null)

    useEffect(() => {
        setWrapper(ref.current)
    }, [])

    return [wrapper, ref]
}

function DateSwiper(props) {
    const [nextEl, nextElRef] = useSwiperRef()
    const [prevEl, prevElRef] = useSwiperRef()
    return (
        <>
            <div ref={prevElRef} className="cinemaDateSwiperLeft">
                <ChevronLeftIcon className="h-8 w-8" aria-hidden="true" />
            </div>
            <Swiper
                slidesPerView={props.slidesPerView}
                spaceBetween={30}
                navigation={{
                    prevEl,
                    nextEl,
                }}
            >
                {props.children}
            </Swiper>
            <div ref={nextElRef} className="cinemaDateSwiperRight">
                <ChevronRightIcon className="h-8 w-8" aria-hidden="true" />
            </div>
        </>
    )
}

const DateTabs = ({ cinemasByDate }) => {
    return (
        <Tab.Group
            vertical
            as="div"
            className="hidden lg:flex lg:flex-col lg:gap-y-8"
        >
            <Tab.List className="flex flex-row">
                <DateSwiper slidesPerView={Math.min(cinemasByDate.length, 5)}>
                    {cinemasByDate.map((dateCinema, i) => (
                        <SwiperSlide key={i}>
                            <Tab
                                as="div"
                                className={({ selected }) =>
                                    selected
                                        ? 'cinemaDateTabSelected'
                                        : 'cinemaDateTabUnselected'
                                }
                            >
                                {formatDateDisplay(dateCinema.date)}
                            </Tab>
                        </SwiperSlide>
                    ))}
                </DateSwiper>
            </Tab.List>
            <div className="hidden xl:flex xl:flex-1" />
            <Tab.Panels>
                {cinemasByDate.map((dateCinema) => (
                    <Tab.Panel
                        key={dateCinema.date}
                        className="cinemaTimingContainer"
                    >
                        {dateCinema.cinemas.map((cinema) => (
                            <CinemaRow key={cinema.cinema} cinema={cinema} />
                        ))}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    )
}

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
    console.log('unique dates: ', uniqueDates)
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
                className="h-[384px] w-full object-cover lg:h-[512px] xl:h-[798px]"
                loading="lazy"
            />
            <div className="container">
                {/* Back to home button */}
                <button
                    className="mt-4 flex flex-row
                    items-center justify-center gap-x-1 py-4 text-slate-400 hover:text-slate-50
                    xl:gap-x-2"
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
                            <p className="infoTag">
                                {movieInfo.tomatoData.rating}
                            </p>
                        )}
                        {movieInfo.runtime > 0 && (
                            <p className="infoTag">
                                {formatRuntime(movieInfo.runtime)}
                            </p>
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
                                        <ScoreIcon
                                            reviewUrl={movieInfo.reviewUrl}
                                            type="critic"
                                            score={
                                                movieInfo.tomatoData.tomatoScore
                                                    .score
                                            }
                                            count={
                                                movieInfo.tomatoData.tomatoScore
                                                    .count
                                            }
                                        />
                                        <ScoreIcon
                                            reviewUrl={movieInfo.reviewUrl}
                                            type="audience"
                                            score={
                                                movieInfo.tomatoData
                                                    .audienceScore.score
                                            }
                                            count={
                                                movieInfo.tomatoData
                                                    .audienceScore.count
                                            }
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
                        <VideoThumbnail video={trailer_url.key} />
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
