export default function getRefs() {
  return {
    //HEADER
    searchInputRef: document.querySelector('.header__search-form-input'),
    searchBtnRef: document.querySelector('.header__form-btn'),
    textError: document.querySelector('.header__search-error'),
    header: document.querySelector('#header'),
    homeLink: document.querySelector('#home-link'),
    libraryLink: document.querySelector('#library-link'),
    btnWatched: document.querySelector('#btn-watched'),
    btnQueue: document.querySelector('#btn-queue'),
    headerForm: document.querySelector('.header__form'),
    headerButton: document.querySelector('.header__button'),
    switchItem: document.querySelector('.theme-switch__control'),
    selector: document.getElementById('theme-switch-toggle'),
    themeSwitch: document.querySelector('.theme-switch'),
    bodyContainer: document.body,
    //MODAL
    modalRef: document.querySelector('.modal-form'),
    modalСardRef: document.querySelector('.modal-form__card'),
    overlayRef: document.querySelector('.overlay'),
    overlayBackgroundRef: document.querySelector('.overlay__bg'),
    clsBtnRef: document.querySelector('.modal-form__close-btn'),
    //HERO
    insertPoint: document.querySelector('.hero__list'),
    spinnerRef: document.querySelector('.loading__spinner'),
    spinnerDotsRefs: document.querySelector('.loading__dots'),
    heroTitle: document.querySelectorAll('.hero__title'),
    //PAGES
    pageNumbersContainer: document.querySelector('.page__numbers--container'),
    nextBtn: document.querySelector('.page__btn--next'),
    prevBtn: document.querySelector('.page__btn--prev'),
    firstPageBtn: document.querySelector('.page__btn--first'),
    lastPageBtn: document.querySelector('.page__btn--last'),
    pageEllipsisStart: document.querySelector('.page__ellipsis--start'),
    pageEllipsisFinish: document.querySelector('.page__ellipsis--finish'),
    pagesContainer: document.querySelector('.page__container'),
    mainContainer: document.querySelector('.main'),
    //FOOTER
    openFooterModalBtn: document.querySelector('[data-footer-modal-open]'),
    closeFooterModalBtn: document.querySelector('[data-footer-modal-close]'),
    footerModal: document.querySelector('[data-footer-modal]'),
    backdropRef: document.querySelector('.backdrop'),
    searchForm: document.querySelector('.js-search-form'),
    backToTopRef: document.querySelector('.back-to-top'),
    footerTheme: document.querySelector('.footer-wrapper'),
  };
}
