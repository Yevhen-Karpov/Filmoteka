import getRefs from '../refs/get-refs';
const { backToTopRef } = getRefs();

window.addEventListener('scroll', backToTopScroll(backToTopRef));
backToTopRef.addEventListener('click', scrollBy);

function scrollBy() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToTopScroll(e) {
  return function toggleScroll() {
    if (pageYOffset < document.documentElement.clientHeight) {
      e.classList.add('visually-hidden');
    } else {
      e.classList.remove('visually-hidden');
    }
  };
}
