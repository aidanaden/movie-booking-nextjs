import 'swiper/css'
import 'swiper/css/navigation'

import { useState, useEffect, useRef } from 'react'
import { Tab } from '@headlessui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import SwiperCore, { Navigation } from 'swiper'

import { formatDateDisplay } from '../../functions/time'
import CinemaRow from '../CinemaRow'

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
                  selected ? 'cinemaDateTabSelected' : 'cinemaDateTabUnselected'
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
          <Tab.Panel key={dateCinema.date} className="cinemaTimingContainer">
            {dateCinema.cinemas.map((cinema) => (
              <CinemaRow key={cinema.cinema} cinema={cinema} />
            ))}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default DateTabs
