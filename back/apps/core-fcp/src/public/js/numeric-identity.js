// PopIn opening and closing handling
(function () {
  const openNumericIdentity = document.getElementById('tuto-numeric-identity');
  const numericIdentityPopIn = document.getElementById('numeric-identity');
  const interactionOverflow = document.querySelector('body');

  const CLASS_CSS_SHOW = 'show';

  const openPopIn = (e) => {
    e.preventDefault();
    numericIdentityPopIn.classList.add(CLASS_CSS_SHOW);
    interactionOverflow.style.overflow = 'hidden';
  }

  const closePopIn = (e) => {
    e.preventDefault();
      numericIdentityPopIn.classList.remove(CLASS_CSS_SHOW);
      interactionOverflow.style.overflow = 'auto';
  }

  const closePopInEsc = (e) => {
      if(e.key === "Escape"){
        closePopIn(e)
      }
  }

  openNumericIdentity.addEventListener('click', openPopIn, true);
  numericIdentityPopIn.addEventListener('click', closePopIn, true); 
  document.addEventListener('keydown',closePopInEsc, true ); 
})();
