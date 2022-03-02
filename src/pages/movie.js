import { useState, Fragment } from "react";
import { Tab } from "@headlessui/react";
import ReactPlayer from "react-player/lazy";
import { TMDB_IMG_URL, formatRuntime } from "utils/urls";

const ScoreIcon = ({ type, score, count }) => {
  const size = 42;
  if (score) {
    return (
      <div className="mt-auto">
        <div
          className={
            type == "audience"
              ? "flex flex-row justify-center space-x-2"
              : "flex flex-row justify-center space-x-3"
          }
        >
          <img
            height={size}
            width={size}
            src={
              type != "audience" && Number(score) <= 60
                ? "/rotten_tomato_rotten.svg"
                : type != "audience" && Number(score) < 80
                ? "/rotten_tomato_fresh.svg"
                : type != "audience" && Number(score) > 80
                ? "/rotten_romato_certified.svg"
                : type == "audience" && Number(score) <= 50
                ? "/rotten_tomato_audience_fail.svg"
                : "/rotten_tomato_audience_certified.svg"
            }
            alt=""
          />
          <p className="text-3xl text-slate-50 md:text-5xl">{score}%</p>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-lg capitalize text-slate-200">
            {type != "audience" ? `Tomatometer` : `Audience score`}
          </h3>
          <p className="mt-0 text-base text-slate-500">
            {type != "audience"
              ? `${count} reviews`
              : `${count} verified ratings`}
          </p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

const VideoThumbnail = ({ video }) => {
  return (
    <div className="rounded-md bg-slate-800">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${video}`}
        light={true}
        style={{
          rounded: "6px",
        }}
        controls={true}
      />
    </div>
  );
};

const VideoList = ({ videos }) => {
  return (
    <div
      className="md:scrollbar-thumb-rounded-full -m-2 flex flex-row
                space-x-4 overflow-x-scroll px-2 pt-2 pb-6 scrollbar-hide
                overflow-y-hidden md:scrollbar-default md:scrollbar-thin
                md:scrollbar-track-transparent md:scrollbar-thumb-slate-600"
    >
      {videos.map((video) => (
        <VideoThumbnail key={video.id} video={video.key} />
      ))}
    </div>
  );
};

const CinemaRow = ({ cinemaName, timings }) => {
  return (
    <div className="flex flex-col justify-start gap-y-6 md:flex-row md:gap-y-0 md:gap-x-24">
      <h3 className="font-moderat_extended text-2xl capitalize text-slate-50">
        {/* <span className='text-gv-yellow'>{theatre}</span> */}
        {cinemaName}
      </h3>
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        {timings.map((timing, i) => (
          <a
            key={i}
            className="uppercasetext-slate-400 rounded-md bg-slate-800 py-2 px-3
            text-xl transition duration-200 hover:bg-slate-600 hover:text-slate-50"
            href={timing.url}
          >
            {timing.split(" ").slice(1, 3).join(" ")}
          </a>
        ))}
      </div>
    </div>
  );
};

const DateTabs = ({ cinemasByDate }) => {
  return (
    <Tab.Group
      vertical
      as="div"
      className="flex flex-col gap-y-4 md:flex-row md:gap-x-4"
    >
      <Tab.List className="flex flex-col gap-y-4 space-y-1 rounded-md bg-blue-900/20 p-1">
        {cinemasByDate.map((dateCinema, i) => (
          <Tab
            as="div"
            key={i}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            {dateCinema.date}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {cinemasByDate.map((dateCinema) => (
          <Tab.Panel key={dateCinema.date} className="flex flex-col gap-y-12">
            {dateCinema.cinemas.map((cinema) => (
              <CinemaRow cinemaName={cinema.cinema} timings={cinema.timings} />
            ))}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Example = () => {
  let [categories] = useState({
    Recent: [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
    Popular: [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
    Trending: [
      {
        id: 1,
        title: "Ask Me Anything: 10 answers to your questions about coffee",
        date: "2d ago",
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: "4d ago",
        commentCount: 1,
        shareCount: 2,
      },
    ],
  });

  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
        <Tab.List className="flex space-y-1 rounded-md bg-blue-900/20 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel key={idx} className="flex flex-col gap-y-12">
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
  );
};

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
          score: "58",
        },
        audienceScore: {
          count: "10,000+",
          score: "84",
        },
      },
      backdrop_path: "/eENEf62tMXbhyVvdcXlnQz2wcuT.jpg",
      genres: [
        {
          id: 878,
          name: "Science Fiction",
        },
        {
          id: 28,
          name: "Action",
        },
        {
          id: 12,
          name: "Adventure",
        },
      ],
    },
  };

  const cinemas = [
    {
      cinema: "Shaw Theatres Paya Lebar",
      timings: [
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
      ],
    },
    {
      cinema: "Shaw Theatres Bedok",
      timings: [
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
      ],
    },
    {
      cinema: "Shaw Theatres Tampines",
      timings: [
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
      ],
    },
    {
      cinema: "Shaw Theatres Lido",
      timings: [
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
      ],
    },
    {
      cinema: "Shaw Theatres Nex",
      timings: [
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "21/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "09/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "04/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "10/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "15/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "14/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "14/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "13/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "11/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "22/12/2021 09:00 AM",
        },
        {
          url: "https://www.shaw.sg/seat-selection/P00000000000000000411919",
          timing: "16/12/2021 09:00 AM",
        },
      ],
    },
  ];
  const movieInfo = data.info;
  const genreText = movieInfo.genres
    .slice(0, 3)
    .map((genre) => {
      return genre.name;
    })
    .join("/");
  const image_path = movieInfo.backdrop_path || movieInfo.poster_path;
  const dates = [];

  cinemas.map((cinema) => {
    cinema.timings.map((timing) => {
      dates.push(timing.timing.split(" ")[0]);
    });
  });

  const uniqueDates = Array.from(new Set(dates));

  const cinemasByDate = [];
  uniqueDates.map((uniqueDate) => {
    const dateData = {
      date: uniqueDate,
      cinemas: [],
    };
    cinemas.map((cinema) => {
      const cinemaDateData = {
        cinema: cinema.cinema,
        timings: [],
      };
      cinema.timings.map((timing) => {
        if (timing.timing.includes(uniqueDate)) {
          cinemaDateData["timings"].push(timing.timing);
        }
      });
      if (cinemaDateData["timings"].length > 0) {
        dateData["cinemas"].push(cinemaDateData);
      }
    });
    if (dateData["cinemas"].length > 0) {
      cinemasByDate.push(dateData);
    }
  });

  cinemasByDate.sort((date1, date2) => (date1.date > date2.date ? 1 : -1));

  return (
    <main className="font-moderat text-slate-400">
      <img
        src={`${TMDB_IMG_URL}/${image_path}`}
        alt=""
        className="h-[384px] w-full object-cover lg:h-[798px]"
        loading="lazy"
      />
      {/* Movie title section */}
      <div className="container">
        <div className="mt-16 md:mt-24">
          <h1 className="titleHeader mb-6">{movieInfo.title}</h1>
          <div
            className="px-auto flex flex-col 
                        items-center justify-center space-y-1 tracking-wide
                        md:flex-row md:space-y-0 md:space-x-6"
          >
            {movieInfo.tomatoData && <p>{movieInfo.tomatoData.rating}</p>}
            <p>{genreText}</p>
            <p className="uppercase">{formatRuntime(movieInfo.runtime)}</p>
          </div>
        </div>
        {/* Overview section */}
        <section className="mb-14 sm:mb-16 lg:mb-24">
          <div
            className="mt-12 flex flex-col-reverse
                        xl:flex-row"
          >
            <div className="mt-16 lg:mt-24 xl:mt-0 xl:mr-32">
              <h2 className="sectionHeader">Overview</h2>
              <p className="max-w-2xl text-base md:text-lg">
                {movieInfo.overview}
              </p>
            </div>
            {movieInfo.tomatoData.tomatoScore &&
              movieInfo.tomatoData.tomatoScore.score && (
                <div
                  className="flex flex-col justify-center gap-y-8
                            md:flex-row md:gap-y-0 md:gap-x-8"
                >
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
          </div>
        </section>
        {/* Videos/Trailers section */}
        {/* <section className='mb-14 sm:mb-16 lg:mb-24'>
                    <h2 className='sectionHeader'>
                        Trailers
                    </h2>
                    <VideoList videos={movieInfo.videos.results} />
                </section> */}
        <section className="mb-14 sm:mb-16 lg:mb-24">
          {/* Timings section */}
          <h2 className="sectionHeader mb-12 lg:mb-16">Timings</h2>
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
        <section className="mb-14 sm:mb-16 lg:mb-24">
          {/* Reviews section */}
        </section>
      </div>
    </main>
  );
}
