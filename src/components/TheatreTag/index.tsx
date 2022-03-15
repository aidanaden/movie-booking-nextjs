interface TheatreTagProp {
  theatre: 'gv' | 'shaw' | 'cathay'
}

const TheatreTag = ({ theatre }: TheatreTagProp) => {
  if (theatre == 'gv') {
    return (
      <div className="cardTheatreTag bg-gv-yellow font-semibold text-slate-900">
        gv
      </div>
    )
  } else if (theatre == 'shaw') {
    return <div className="cardTheatreTag bg-shaw-red">shaw</div>
  } else if (theatre == 'cathay') {
    return <div className="cardTheatreTag bg-cathay-pink">cathay</div>
  } else {
    return <div></div>
  }
}

export default TheatreTag
