import getRefs from '../refs/get-refs';
const { insertPoint, spinnerRef, spinnerDotsRefs } = getRefs();

function startSpinner() {
  spinnerRef.classList.remove('visually-hidden');
  spinnerDotsRefs.classList.remove('visually-hidden');
}

function stopSpinner() {
  spinnerRef.classList.add('visually-hidden');
  spinnerDotsRefs.classList.add('visually-hidden');
}

export { startSpinner, stopSpinner };