import getRefs from '../refs/get-refs';

(() => {
  const { openFooterModalBtn, closeFooterModalBtn, footerModal, themeSwitch } = getRefs();

  openFooterModalBtn.addEventListener('click', toggleModal);
  closeFooterModalBtn.addEventListener('click', toggleModal);

  window.onclick = function (e) {
    if (e.target == footerModal) {
      footerModal.classList.toggle('is-hidden');
    }
    if (e.code === 'Escape') {
      footerModal.classList.toggle('is-hidden');
    }
  };

  function toggleModal() {
    footerModal.classList.toggle('is-hidden');
    themeSwitch.classList.toggle('disabled');
  }
})();
