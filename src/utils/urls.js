export const TMDB_IMG_URL = "https://image.tmdb.org/t/p/original";

export const formatRuntime = (runtime) => {
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
};
