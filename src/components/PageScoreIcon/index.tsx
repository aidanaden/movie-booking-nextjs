import NextImage from 'next/image'

interface PageScoreIconProps {
  reviewUrl: string
  type: 'critic' | 'audience'
  score: string
  count: string
}

const PageScoreIcon = ({
  reviewUrl,
  type,
  score,
  count,
}: PageScoreIconProps) => {
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
          <p className="text-3xl text-slate-50 md:text-5xl">{score}%</p>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-lg capitalize text-slate-200">
            {type != 'audience' ? `Tomatometer` : `Audience score`}
          </h3>
          <a
            className="mt-0 text-base text-slate-500 hover:text-slate-50 hover:underline"
            href={type != 'audience' ? criticReviewUrl : audienceReviewUrl}
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

export default PageScoreIcon

