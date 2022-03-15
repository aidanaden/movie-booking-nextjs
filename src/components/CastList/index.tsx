import { Cast } from '../../types'
import CastThumbnail from '../CastThumbnail'

interface CastValues {
  popularCasts: Cast[]
  director: Cast
}

interface CastListProp {
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

export default CastList
