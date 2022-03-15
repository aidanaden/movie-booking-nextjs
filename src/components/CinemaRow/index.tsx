import { Cinema } from '../../types'
import { formatTimeDisplay } from '../../functions/time'

interface CinemaRowProp {
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

export default CinemaRow
