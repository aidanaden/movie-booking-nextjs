export const formatRuntime = (runtime) => {
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`
}
