import getRefs from '../refs/get-refs';
import API from '../API/api-service';
import searchErr from './search-error';
import card from '../../handlebars/cardMovie.hbs';
import renderPagination from './pages';
const { searchForm, insertPoint } = getRefs();
const api = new API();

import { startSpinner, stopSpinner } from './spinner.js';
import createCardData from '../data/create-card-data';

searchForm.addEventListener('submit', onSearchInput);

async function onSearchInput(e) {
  e.preventDefault();
  const value = e.currentTarget.elements.query.value;
  if (!value.trim()) return;
  initialReset();

  try {
    api._setQuery(value);
    startSpinner();
    const data = await api.fetchMovieSearchQuery();
    const result = await data.results;
    const markup = await createCardData(result);
    if (!result.length) {
      searchErr(true);
      stopSpinner();
      return;
    }
    insertPoint.insertAdjacentHTML('beforeend', card(markup));
    renderPagination('searchQuery', data.total_pages, value);
    stopSpinner();
  } catch (error) {
    console.error(error);
  }
}

function initialReset() {
  insertPoint.innerHTML = '';
  searchErr(false);
  api._setPage(1);
}
