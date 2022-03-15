export interface Cast {
  id: number
  name: string
  profile_path: string
  character: string
  job: string
}

interface MovieData {
  cinemas: any
  info: any
}

export interface MovieCardData {
  id: number
  slug: string
  data: MovieData
}

interface Timing {
  url: string
  status: 'AVAILABLE' | 'SELLING FAST' | 'SOLD OUT'
  timing: string
}

export interface Cinema {
  cinema: string
  theatre: 'gv' | 'shaw' | 'Cathay'
  timings: Timing[]
}
