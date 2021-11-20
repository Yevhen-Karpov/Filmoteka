import API from '../API/api-service';
import imageCardsTemplate from '../../handlebars/cardMovie.hbs';
import createCardData from '../data/create-card-data';
import { startSpinner, stopSpinner } from './spinner';
import getRefs from '../refs/get-refs';
const {
  insertPoint,
  pageNumbersContainer,
  nextBtn,
  prevBtn,
  firstPageBtn,
  lastPageBtn,
  pageEllipsisStart,
  pageEllipsisFinish,
  pagesContainer,
  header,
} = getRefs();

const api = new API();
let request = null;
let searchInputValue = null;
let totalPages = null;
let markupArray = [];
let pagesInView = 5;

pageNumbersContainer.addEventListener('click', onPageNumberClick);
nextBtn.addEventListener('click', onNextBtnClick);
prevBtn.addEventListener('click', onPrevBtnClick);
firstPageBtn.addEventListener('click', onFirstPageBtnClick);
lastPageBtn.addEventListener('click', onLastPageBtnClick);
pagesContainer.addEventListener('click', smoothScroll);

function smoothScroll() {
  setTimeout(() => {
    header.scrollIntoView({
      behavior: 'smooth',
    });
  }, 500);
}

export default function renderPagination(requestValue, totalPagesNumber, searchValue) {
  pagesContainer.classList.remove('page__hidden');
  request = requestValue;
  searchInputValue = searchValue;
  totalPages = totalPagesNumber;
  const totalPagesArray = [];
  pageNumbersContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i += 1) {
    totalPagesArray.push(i);
  }
  const pagesMarkup = totalPagesArray.map(page => {
    return `<div class="page__number page__block">${page}</div>`;
  });

  markupArray = pagesMarkup;
  let firstSliceElement = 0;
  let activeIndex = 0;
  insertNewPages(markupArray, activeIndex, firstSliceElement, pagesInView);
  return;
}

function insertNewPages(markupArray, activeIndex, firstSliceElement, lastSliceElement) {
  const pagesMarkupArray = [...markupArray];
  const newPagesMarkupArray = pagesMarkupArray.slice(firstSliceElement, lastSliceElement);
  pageNumbersContainer.innerHTML = '';
  pageNumbersContainer.insertAdjacentHTML('beforeend', newPagesMarkupArray.join(''));
  const newPages = document.querySelectorAll('.page__number');
  newPages[activeIndex].classList.add('page__number--active');
  let firstEl = Number(newPages[0].innerText);
  let newPageslength = newPages.length;
  setFirstPageBtn(firstEl);
  setLastPageBtn(firstEl, newPageslength);
  setEllipsis(firstEl, newPages.length);
  let activePage = Number(newPages[activeIndex].innerText)
  setPrevBtn(activePage, firstEl);
  setNextBtn(Number(newPages[newPageslength-1].innerText), activePage)
  // lastPageBtn.addEventListener('click', onLastPageBtnClick);
}

function getActivePages() {
  let allPages = document.getElementsByClassName('page__number');
  const currentActivePage = document.querySelector('.page__number--active');
  let allPagesArray = Array.from(allPages);
  return {
    currentActivePage: currentActivePage,
    currentNumber: Number(currentActivePage.innerText),
    allPagesArray: allPagesArray,
  };
}

function onPageNumberClick(e) {
  const { currentActivePage, allPagesArray } = getActivePages(e);
  const pageNumber = Number(e.target.innerText);
  currentActivePage.classList.remove('page__number--active');
  e.target.classList.add('page__number--active');
  setPrevBtn(pageNumber, Number(allPagesArray[0].innerText));
  let lastEl = Number(allPagesArray[allPagesArray.length - 1].innerText)
  setNextBtn(lastEl, Number(e.target.innerText))
  fetchFilms(pageNumber);
}

function onNextBtnClick() {
  let { currentActivePage, currentNumber, allPagesArray } = getActivePages();
  if (currentNumber === totalPages) {
    return;
  }
  if (currentNumber % pagesInView === 0) {
    const insertionsTotal = currentNumber / pagesInView;
    let firstSliceElement = pagesInView * insertionsTotal;
    let lastSliceElement = pagesInView + pagesInView * insertionsTotal;
    let activeIndex = 0;
    insertNewPages(markupArray, activeIndex, firstSliceElement, lastSliceElement);
  }
  for (let i = 0; i < allPagesArray.length; i += 1) {
    if (i === pagesInView - 1) {
      allPagesArray = [...document.getElementsByClassName('page__number')];
    }
    if (allPagesArray[i] == currentActivePage) {
      currentActivePage.classList.remove('page__number--active');
      allPagesArray[i + 1].classList.add('page__number--active');
    }
  }
  let pageNumber = currentNumber + 1;
  setPrevBtn(pageNumber, Number(allPagesArray[0].innerText))
  let lastEl = Number(allPagesArray[allPagesArray.length-1].innerText)
  setNextBtn(lastEl, pageNumber)
  fetchFilms(pageNumber);
}

function onPrevBtnClick() {
  const { currentActivePage, currentNumber, allPagesArray } = getActivePages();
  if (currentNumber === 1) {
    return;
  }
  if ((currentNumber - 1) % pagesInView === 0) {
    let firstSliceElement = currentNumber - 1 - pagesInView;
    let lastSliceElement = currentNumber - 1;
    let activeIndex = pagesInView - 1;
    insertNewPages(markupArray, activeIndex, firstSliceElement, lastSliceElement);
  }
  for (let i = 1; i < pagesInView; i += 1) {
    if (allPagesArray[i] == currentActivePage) {
      currentActivePage.classList.remove('page__number--active');
      allPagesArray[i - 1].classList.add('page__number--active');
    }
  }
  let lastEl = Number(allPagesArray[allPagesArray.length - 1])
  let pageNumber = currentNumber - 1;
  setNextBtn(lastEl, pageNumber);
  fetchFilms(pageNumber);
}

function onLastPageBtnClick(e) {
  const { currentActivePage } = getActivePages();
  const lastPageValue = Number(e.target.innerText);
  let firstSliceElement = null;
  let activeIndex = 0;
  if (totalPages % 5 === 0) {
    firstSliceElement = totalPages - pagesInView;
    activeIndex = pagesInView - 1;
  } else {
    firstSliceElement = totalPages - (totalPages % 5);
    activeIndex = (totalPages % 5) - 1;
  }
  insertNewPages(markupArray, activeIndex, firstSliceElement);
  fetchFilms(lastPageValue);
}

function onFirstPageBtnClick() {
  const { currentActivePage } = getActivePages();
  let firstSliceElement = 0;
  let activeIndex = 0;
  insertNewPages(markupArray, activeIndex, firstSliceElement, pagesInView);
  fetchFilms(1);
}

function setPrevBtn(activeEl, firstEl) {
  if (totalPages < pagesInView || (activeEl === 1 && firstEl === 1)) {
    prevBtn.classList.add('page__hidden');
  } else {
    prevBtn.classList.remove('page__hidden');
  }
}

function setNextBtn(lastEl, activePage) {
  if (totalPages < pagesInView || (totalPages === lastEl && totalPages === activePage)) {
    nextBtn.classList.add('page__hidden');
  } else {
    nextBtn.classList.remove('page__hidden');
  }
}

function setFirstPageBtn(firstEl) {
  if (firstEl > 1) {
    firstPageBtn.classList.remove('page__hidden');
  } else {
    firstPageBtn.classList.add('page__hidden');
  }
}

function setLastPageBtn(firstEl, length) {
  if (firstEl > totalPages - length) {
    lastPageBtn.classList.add('page__hidden');
  } else {
    lastPageBtn.classList.remove('page__hidden');
    lastPageBtn.innerText = totalPages;
  }
}

function setEllipsis(firstEl, length) {
  if (totalPages < pagesInView) {
    pageEllipsisFinish.classList.add('page__hidden');
    pageEllipsisStart.classList.add('page__hidden');
  } else if (firstEl + length - 1 === totalPages) {
    pageEllipsisFinish.classList.add('page__hidden');
  } else if (firstEl >= 1 && firstEl + length - 1 < totalPages - 2) {
    pageEllipsisFinish.classList.remove('page__hidden');
  }
  if (firstEl > 1) {
    pageEllipsisStart.classList.remove('page__hidden');
  }
  if (firstEl === 1) {
    pageEllipsisStart.classList.add('page__hidden');
  }
}

async function fetchFilms(pageNumber) {
  startSpinner();
  try {
    api._setPage(pageNumber);
    api._setQuery(searchInputValue);
    let data;
    let markup;
    insertPoint.innerHTML = '';
    if (request == 'searchQuery') {
      data = await api.fetchMovieSearchQuery();
      let result = await data.results;
      markup = await createCardData(result);
    } else if (request == 'home') {
      data = await api.fetchMovieTrending();
      let result = await data.results;
      markup = await createCardData(result);
    } else if (request == 'Watched') {
      let parsedResult = localStorage.getItem('Watched')
        ? JSON.parse(localStorage.getItem('Watched'))
        : [];
      insertPoint.innerHTML = '';
      markup = getWatchedAndQueuedFilmsMarkup(parsedResult, pageNumber);
    } else if (request == 'Queue') {
      let parsedResult = localStorage.getItem('Queue')
        ? JSON.parse(localStorage.getItem('Queue'))
        : [];
      markup = getWatchedAndQueuedFilmsMarkup(parsedResult, pageNumber);
    }

    insertPoint.insertAdjacentHTML('beforeend', imageCardsTemplate(markup));
    stopSpinner();
  } catch (error) {
    console.error(error);
  }
}

function getWatchedAndQueuedFilmsMarkup(parsedResult, pageNumber) {
  let result = null;
  result = parsedResult.slice(0, 5);
  if (parsedResult.length <= 20) {
    result = parsedResult;
  } else if (pageNumber === 1) {
    result = parsedResult.slice(0, 20);
  } else if (parsedResult.length - 20 * pageNumber > 20) {
    result = parsedResult.slice(20 * (pageNumber - 1), 20 * pageNumber);
  } else {
    result = parsedResult.slice(20 * (pageNumber - 1));
  }
  return result;
}
