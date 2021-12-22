import { useState, Fragment } from 'react'
import { Tab } from '@headlessui/react'
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

const CinemaRow = ({ cinemaName, timings }) => {
    return (
        <div
            className='flex flex-col gap-y-6
            md:flex-row md:gap-y-0 md:gap-x-24
            justify-start'
        >
            <h3 className='text-slate-50 capitalize text-2xl font-moderat_extended'>
                {/* <span className='text-gv-yellow'>{theatre}</span> */}
                {cinemaName}
            </h3>
            <div className='flex flex-wrap gap-x-6 gap-y-4'>
                {timings.map((timing, i) => (
                    <a
                        key={i}
                        className='text-slate-400 uppercase
                        hover:bg-slate-600 hover:text-slate-50 text-xl duration-200
                        transition bg-slate-800 rounded-md py-2 px-3'
                        href={timing.url}
                    >
                        {timing.split(' ').slice(1, 3).join(' ')}
                    </a>
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
            className='flex flex-col gap-y-4 md:flex-row md:gap-x-4'
        >
            <Tab.List
                className="flex flex-col gap-y-4 p-1 space-y-1 bg-blue-900/20 rounded-md"
            >
                {cinemasByDate.map((dateCinema, i) => (
                    <Tab
                        as='div'
                        key={i}
                        className={({ selected }) =>
                            classNames(
                                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                            )
                        }
                    >
                        {dateCinema.date}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels>
                {cinemasByDate.map((dateCinema) => (
                    <Tab.Panel
                        key={dateCinema.date}
                        className='flex flex-col gap-y-12'
                    >
                        {dateCinema.cinemas.map((cinema) => (
                            <CinemaRow
                                cinemaName={cinema.cinema}
                                timings={cinema.timings}
                            />
                        ))}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    )
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Example = () => {
    let [categories] = useState({
        Recent: [
            {
                id: 1,
                title: 'Does drinking coffee make you smarter?',
                date: '5h ago',
                commentCount: 5,
                shareCount: 2,
            },
            {
                id: 2,
                title: "So you've bought coffee... now what?",
                date: '2h ago',
                commentCount: 3,
                shareCount: 2,
            },
        ],
        Popular: [
            {
                id: 1,
                title: 'Is tech making coffee better or worse?',
                date: 'Jan 7',
                commentCount: 29,
                shareCount: 16,
            },
            {
                id: 2,
                title: 'The most innovative things happening in coffee',
                date: 'Mar 19',
                commentCount: 24,
                shareCount: 12,
            },
        ],
        Trending: [
            {
                id: 1,
                title: 'Ask Me Anything: 10 answers to your questions about coffee',
                date: '2d ago',
                commentCount: 9,
                shareCount: 5,
            },
            {
                id: 2,
                title: "The worst advice we've ever heard about coffee",
                date: '4d ago',
                commentCount: 1,
                shareCount: 2,
            },
        ],
    })

    return (
        <div className="w-full max-w-md px-2 py-16 sm:px-0">
            <Tab.Group className='flex flex-col gap-y-4 md:flex-row md:gap-x-4'>
                <Tab.List className="flex p-1 space-y-1 bg-blue-900/20 rounded-md">
                    {Object.keys(categories).map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    {Object.values(categories).map((posts, idx) => (
                        <Tab.Panel
                            key={idx}
                            className='flex flex-col gap-y-12'
                        >
                            {cinemas.map((cinema) => (
                                <CinemaRow
                                    cinemaName={cinema.cinema}
                                    timings={cinema.timings}
                                />
                            ))}
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}


export default function movie() {
    const data = {
        info: {
            id: 580489,
            adult: false,
            title: "Venom: Let There Be Carnage",
            video: false,
            budget: 110000000,
            runtime: 97,
            tomatoData: {
                rating: "PG-13",
                tomatoScore: {
                    count: "255",
                    score: "58"
                },
                audienceScore: {
                    count: "10,000+",
                    score: "84"
                }
            },
            backdrop_path: "/eENEf62tMXbhyVvdcXlnQz2wcuT.jpg",
            genres: [
                {
                    id: 878,
                    name: "Science Fiction"
                },
                {
                    id: 28,
                    name: "Action"
                },
                {
                    id: 12,
                    name: "Adventure"
                }
            ],
        }
    }

    const cinemas = [
        {
            cinema: "Shaw Theatres Paya Lebar",
            timings: [
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
            ]
        },
        {
            cinema: "Shaw Theatres Bedok",
            timings: [
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
            ]
        },
        {
            cinema: "Shaw Theatres Tampines",
            timings: [
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
            ]
        },
        {
            cinema: "Shaw Theatres Lido",
            timings: [
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
            ]
        },
        {
            cinema: "Shaw Theatres Nex",
            timings: [
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "21/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "09/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "04/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "10/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "15/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "14/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "14/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "13/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "11/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "22/12/2021 09:00 AM"
                },
                {
                    url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
                    timing: "16/12/2021 09:00 AM"
                },
            ]
        },
    ]
    const movieInfo = data.info
    const genreText = movieInfo.genres.slice(0, 3).map(genre => { return genre.name }).join('/')
    const image_path = movieInfo.backdrop_path || movieInfo.poster_path
    const dates = []

    cinemas.map((cinema) => {
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
        cinemas.map((cinema) => {
            const cinemaDateData = {
                cinema: cinema.cinema,
                timings: []
            }
            cinema.timings.map((timing) => {
                if (timing.timing.includes(uniqueDate)) {
                    cinemaDateData['timings'].push(timing.timing)
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
                className='object-cover w-full h-[384px] lg:h-[798px]'
                loading='lazy'
            />
            {/* Movie title section */}
            <div className='container'>
                <div className='mt-16 md:mt-24'>
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
                <section className='mb-14 sm:mb-16 lg:mb-24'>
                    <div
                        className='flex flex-col-reverse xl:flex-row
                        mt-12'
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
                {/* <section className='mb-14 sm:mb-16 lg:mb-24'>
                    <h2 className='sectionHeader'>
                        Trailers
                    </h2>
                    <VideoList videos={movieInfo.videos.results} />
                </section> */}
                <section className='mb-14 sm:mb-16 lg:mb-24'>
                    {/* Timings section */}
                    <h2 className='sectionHeader mb-12 lg:mb-16'>
                        Timings
                    </h2>
                    <DateTabs cinemasByDate={cinemasByDate} />
                    {/* <div className='flex flex-col gap-y-12'>
                        {cinemas.map((cinema) => (
                            <CinemaRow
                                cinemaName={cinema.cinema}
                                timings={cinema.timings}
                            />
                        ))}
                    </div> */}
                </section>
                <section className='mb-14 sm:mb-16 lg:mb-24'>
                    {/* Reviews section */}
                </section>
            </div>
            
        </main>
    )
}