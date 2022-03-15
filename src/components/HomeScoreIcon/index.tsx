import NextImage from 'next/image'

interface HomeScoreIconProps {
  type: 'critic' | 'audience'
  score: string
  count: string
}

const HomeScoreIcon = ({ type, score, count }: HomeScoreIconProps) => {
  const size = 40
  if (score) {
    return (
      <div
        className={
          type == 'audience'
            ? 'flex flex-row items-center space-x-1'
            : 'flex flex-row items-center space-x-2'
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
        <div className="cardRating">
          {score}%
          <span className="text-base text-slate-500"> ({`${count}`})</span>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

export default HomeScoreIcon