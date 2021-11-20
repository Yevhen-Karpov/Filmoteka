import API from '../API/api-service';
import comingSoon from '../../images/coming-soon.jpg';

const api = new API();

async function createModalFilmData(id) {
  api._setId(id);

  const description = await api.fetchMovieDescription();
  const trailerData = await api.fetchMovieTrailer();

  trailerData.find(trailer => {
    const OfficialTrailer = 'official trailer';
    if (trailer.name.toLowerCase() === OfficialTrailer) {
    }
  });

  const {
    poster_path,
    title,
    vote_average,
    vote_count,
    popularity,
    genres,
    overview,
    backdrop_path,
    release_date,
  } = description;

  const poster = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : comingSoon;

  const backdrop = backdrop_path ? `https://image.tmdb.org/t/p/w500${backdrop_path}` : poster;

  const date = release_date ? release_date.slice(0, 4) : '';

  const genres_type = genres.map(genre => genre.name);

  return {
    id,
    poster,
    title,
    vote_average,
    vote_count,
    popularity,
    genres_type,
    overview,
    backdrop,
    date,
  };
}

export default createModalFilmData;
