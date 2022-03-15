import { useState, useEffect, Fragment, useRef } from 'react'
import { Tab, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { formatDateDisplay } from '../../functions/time'
import CinemaRow from '../CinemaRow'

const DateSelector = ({ cinemasByDate }) => {
  const [selected, setSelected] = useState(cinemasByDate[0])
  return (
    <div className="lg:hidden">
      <div className="sticky:shadow-lg sticky top-0 mb-12 w-full bg-woodsmoke-900">
        <Listbox value={selected} onChange={setSelected}>
          <div className="-mx-4 mt-1 bg-woodsmoke-900 px-4 py-4">
            <Listbox.Button
              className="w-full cursor-default rounded-md border-2 border-slate-800
            py-4 px-4 text-left text-slate-50 active:bg-slate-600 active:text-slate-400"
            >
              <div className="relative text-center text-xl uppercase">
                {formatDateDisplay(selected.date)}
                <span
                  className="pointer-events-none absolute right-0 top-0
                bottom-0 flex items-center pr-2"
                >
                  <SelectorIcon
                    className="h-6 w-6 text-slate-400"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute z-40 mt-1 flex
                                max-h-72 w-full flex-col gap-y-1 overflow-auto
                                rounded-md bg-slate-700 p-2 text-xl font-medium"
              >
                {cinemasByDate.map((dateData, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `${
                        active
                          ? 'bg-slate-200 text-slate-800'
                          : 'text-slate-400'
                      }
                      relative flex cursor-default select-none flex-row justify-center
                      rounded-md px-3 py-2 text-center uppercase`
                    }
                    value={dateData}
                  >
                    {({ selected, active }) => (
                      <>
                        <span>{formatDateDisplay(dateData.date)}</span>
                        {selected ? (
                          <span
                            className={`${
                              active ? 'text-slate-800' : 'text-slate-800'
                            }
                            pointer-events-none absolute right-0 top-0 bottom-0
                            flex items-center pr-2`}
                          >
                            <CheckIcon className="h-6 w-6" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <div className="cinemaTimingContainer">
        {selected.cinemas.map((cinema) => (
          <CinemaRow key={cinema.cinema} cinema={cinema} />
        ))}
      </div>
    </div>
  )
}

export default DateSelector
