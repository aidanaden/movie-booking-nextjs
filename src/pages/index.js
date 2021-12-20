import { useState } from 'react'
import Head from 'next/head'

import TheatreTabs from 'components/TheatreTabs'
import MovieList from 'components/MovieList'

export default function Home({ data }) {
  const [selectedTheatre, setSelectedTheatre] = useState('all')

  return (
    <div className='min-h-screen bg-woodsmoke-900'>
      <Head>
        <title>Movie booking SG | Book movie tickets for any cinema in SG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='container text-woodsmoke-100'>
        <div className='titleHeader my-24'>
          Now showing (sg)
        </div>
        <div>
          {/* <TheatreTabs selectedTheatre={selectedTheatre} theatres={data.theatres} /> */}
          <MovieList data={data}/>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps(context) {
  const fetchData = await fetch(`http://128.199.142.207:8000/api/`)
  const dataJson = await fetchData.json()
  return {
    props: {
      data: dataJson
    }
  }
}
