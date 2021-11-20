import getRefs from '../refs/get-refs';
export const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};
const { selector, bodyContainer, footerTheme } = getRefs();
const themeInLocal = localStorage.getItem('theme');

selector.addEventListener('click', switchTemes);
selector.addEventListener('click', setLocalStorage);

function switchTemes(e) {
  bodyContainer.classList.toggle(Theme.LIGHT);
  bodyContainer.classList.toggle(Theme.DARK);
  footerTheme.classList.toggle(Theme.LIGHT);
  footerTheme.classList.toggle(Theme.DARK);
}

function setLocalStorage(evt) {
  if (selector.checked) {
    localStorage.setItem('theme', Theme.DARK);
  } else {
    localStorage.setItem('theme', Theme.LIGHT);
  }
}

if (themeInLocal === Theme.DARK) {
  bodyContainer.classList.add(Theme.DARK);
  footerTheme.classList.add(Theme.DARK);
  selector.checked = true;
}
