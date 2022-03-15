import parse from 'date-fns/parse'
import format from 'date-fns/format'

export const formatRuntime = (runtime) => {
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`
}

export const formatTimeDisplay = (dateTime: string) => {
  return dateTime.split(' ').slice(1, 3).join(' ').trim()
}

export const formatDateDisplay = (dateText: string) => {
  const dateParsed = parse(dateText, 'dd/MM/yyyy', new Date())
  return format(dateParsed, 'EEE dd/MM/yyyy')
}
