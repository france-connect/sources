(function () {
  document
    .getElementById('toggleOpenCloseMenu')
    .addEventListener('click', () => {
      const toggleMenu = document.getElementById('openCloseMenu');

      if (toggleMenu.className.includes(' open')) {
        toggleMenu.className = toggleMenu.className.slice(0, -5);
      } else {
        toggleMenu.className += ' open';
      }
    });
})();
