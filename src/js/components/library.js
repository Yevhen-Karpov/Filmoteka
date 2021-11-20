import getRefs from '../refs/get-refs';
import card from '../../handlebars/cardMovie.hbs';
import renderPagination from './pages';
export let currentStorage;
const {
  libraryLink,
  homeLink,
  btnWatched,
  btnQueue,
  header,
  headerForm,
  headerButton,
  insertPoint,
  pagesContainer,
  mainContainer,
} = getRefs();

btnWatched.addEventListener('click', watchedStorage);
btnQueue.addEventListener('click', queuedStorage);
libraryLink.addEventListener('click', openLibrary);

function openLibrary() {
  insertPoint.innerHTML = '';
  header.classList.replace('header__background-home', 'header__background-library');
  homeLink.classList.remove('active');
  libraryLink.classList.add('active');
  headerForm.classList.add('disabled');
  headerButton.classList.remove('disabled');
  pagesContainer.classList.add('page__hidden');
  mainContainer.classList.add('enabled');
}
function watchedStorage() {
  pagesContainer.classList.add('page__hidden');
  changeStorage('Watched');
  currentStorage = 'Watched';
  btnQueue.classList.remove('in-active');
  btnWatched.classList.add('in-active');
}

function queuedStorage() {
  pagesContainer.classList.add('page__hidden');
  changeStorage('Queue');
  currentStorage = 'Queue';
  btnWatched.classList.remove('in-active');
  btnQueue.classList.add('in-active');
}

export function changeStorage(value) {
  insertPoint.innerHTML = '';
  pagesContainer.classList.add('page__hidden');

  let items = JSON.parse(localStorage.getItem(value));
  if (!items) return;
  let firstPageItems = items.slice(0, 20);
  insertPoint.insertAdjacentHTML('beforeend', card(firstPageItems));
  mainContainer.classList.remove('enabled');
  if (items.length) {
    pagesContainer.classList.remove('page__hidden');
    let totalPages = items.length > 20 ? Math.floor(items.length / 20) + 1 : 1;
    renderPagination(value, totalPages);
  }
}
