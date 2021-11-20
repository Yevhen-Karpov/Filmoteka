import getRefs from '../refs/get-refs';
import createModalFilm from '../data/create-modal-film-data';
import modal from '../../handlebars/modal.hbs';
import getTrailer from './get-trailer';
import { currentStorage, changeStorage } from './library';
import { Theme } from './theme';
//firesase connect
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  get,
  set,
  child,
  onValue,
  update,
  remove,
} from 'firebase/database';
const firebaseConfig = {
  apiKey: 'AIzaSyDz5m2g3hqCF15W-uFl0vbqjJ6T2kankW4',
  authDomain: 'js-project-of-group-12-579b9.firebaseapp.com',
  databaseURL:
    'https://js-project-of-group-12-579b9-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'js-project-of-group-12-579b9',
  storageBucket: 'js-project-of-group-12-579b9.appspot.com',
  messagingSenderId: '785273017337',
  appId: '1:785273017337:web:4779ed9ab176caf238a328',
  measurementId: 'G-7QSLF24SX3',
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();
//firebase

const {
  insertPoint,
  modalRef,
  modalСardRef,
  overlayBackgroundRef,
  overlayRef,
  clsBtnRef,
  themeSwitch,
  libraryLink,
} = getRefs();
let movieID;

insertPoint.addEventListener('click', onClickOnCard);
//Вешаем слушатели на кнопки
modalСardRef.addEventListener('click', onModalBtnClick);

async function onClickOnCard(e) {
  if (e.target.nodeName !== 'UL') {
    e.preventDefault();

    //Получаем ID фильма из data-атрибута, делаем запрос по ID на API-сервис
    const imgRef = e.target.parentNode.querySelector('img');
    const result = await createModalFilm(imgRef.dataset.src);
    movieID = result.id;
    //Получаем разметку модального окна по шаблону и вставляем ее модальное окно
    modalСardRef.insertAdjacentHTML('beforeend', modal(result));
    //Устанавливаем текущую тему
    if (localStorage.getItem('theme') === Theme.DARK) {
      modalRef.classList.add(Theme.DARK);
      modalRef.classList.remove(Theme.LIGHT);
    } else {
      modalRef.classList.remove(Theme.DARK);
      modalRef.classList.add(Theme.LIGHT);
    }
    //Добавляем данные фильма в LS для возможного добавления карточки в библиотеку
    addItemToLocalStorage(result);
    addItemToFirebase(result);
    getTrailer(movieID);
    //Показываем фоновый постер с оверлеем
    overlayBackgroundRef.classList.add('is-open');
    overlayRef.classList.add('is-open');
    themeSwitch.classList.add('disabled');
    overlayBackgroundRef.style.backgroundImage = `linear-gradient(rgb(255, 255, 255, 0.1), rgb(255, 255, 255, 0.1)), url("${result.backdrop}")`;
    //Проверяем, есть ли текущий фильм в библиотеке, если да - делаем активными соотв. кнопки
    setButtonView(movieID, modalСardRef.querySelector('#btn-add-watched'));
    setButtonView(movieID, modalСardRef.querySelector('#btn-add-to-queue'));
    //Варианты закрытия модального окна: кнопка закрытия, клик по оверлею, ESC
    clsBtnRef.addEventListener('click', closeModal);
    overlayRef.addEventListener('click', e => {
      if (e.target === overlayRef) closeModal();
    });
    window.addEventListener('keydown', e => {
      const trailerRef = document.querySelector('.basicLightbox');
      if (e.code === 'Escape' && !trailerRef) closeModal();
    });
  }
}

function onModalBtnClick(e) {
  if (e.target.nodeName === 'BUTTON' && !e.target.classList.contains('modal-form__trailer')) {
    if (e.target.classList.contains('btn--active'))
      deleteItemFromLibrary(e.target.dataset.lib, movieID);
    else addItemToLibrary(e.target.dataset.lib);
    addItemToLibraryFirebase(e.target.dataset.lib);
    setButtonView(movieID, e.target);
  }
}
//localStorage add
function addItemToLocalStorage(res) {
  localStorage.setItem('ky', JSON.stringify(res));
}
//firebase add + remove
function addItemToFirebase(result) {
  set(ref(db, 'ky'), result);
}
function removeItemToFirebase() {
  remove(ref(db, 'ky'));
}
//localStorage addItemToLibrary
function addItemToLibrary(collection) {
  let arrLib = JSON.parse(localStorage.getItem(collection));
  if (!arrLib) arrLib = [];
  arrLib.push(JSON.parse(localStorage.getItem('ky')));
  localStorage.setItem(collection, JSON.stringify(arrLib));
}
//firebase addItemToLibrary
function addItemToLibraryFirebase(collection) {
  let arr = [];
  get(ref(db, 'ky')).then(data => {
    // console.log(data.val());
    arr.push(data.val());
    // console.log('массив из базы', arr);
    set(ref(db, collection), arr).then(); //data => console.log(data));
  });

  // let arrLib = []
  // onValue(ref(db, 'ky'), (e) => {
  //   e.forEach((echild) => {
  //     arrLib.push(echild.val())
  //    })
  //   console.log('firebase', arrLib);
  //   push(ref(db,collection), arrLib)
  //  })
}
function deleteItemFromLibrary(collection, id) {
  let arrLib = JSON.parse(localStorage.getItem(collection));
  let arrRes = JSON.stringify(arrLib.filter(el => el.id !== id));
  localStorage.setItem(collection, arrRes);
}

function setButtonView(movieID, btnRef) {
  let arrFromLS = JSON.parse(localStorage.getItem(btnRef.dataset.lib));
  if (!arrFromLS) arrFromLS = [];

  if (arrFromLS.some(el => el.id === movieID)) {
    btnRef.classList.add('btn--active');
    btnRef.textContent = btnRef.dataset.textlib;
    return;
  }
  btnRef.classList.remove('btn--active');
  btnRef.textContent = btnRef.dataset.textcont;
}

function closeModal() {
  modalСardRef.innerHTML = '';
  themeSwitch.classList.remove('disabled');
  overlayBackgroundRef.classList.remove('is-open');
  overlayRef.classList.remove('is-open');
  clsBtnRef.removeEventListener('click', closeModal);
  overlayRef.removeEventListener('click', closeModal);
  window.removeEventListener('keydown', closeModal);
  localStorage.removeItem('ky');
  removeItemToFirebase();
  if (libraryLink.classList.contains('active')) changeStorage(currentStorage);
}
