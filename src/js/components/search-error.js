import getRefs from '../refs/get-refs';
const { textError, pagesContainer } = getRefs();

export default function (isTrue) {
  if (isTrue) {
    textError.classList.remove('is-hidden');
    pagesContainer.style.pointerEvents = 'none';
    pagesContainer.classList.add('page__hidden');

    return;
  }
  textError.classList.add('is-hidden');
  pagesContainer.style.pointerEvents = 'initial';
  pagesContainer.classList.remove('page__hidden');
}
