(function() {
  var masthead = document.querySelector('.masthead');
  var toggle = document.querySelector('.menu-toggle');
  if (!masthead || !toggle) return;

  function setOpen(open) {
    masthead.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function() {
    setOpen(!masthead.classList.contains('menu-open'));
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') setOpen(false);
  });
  // Opening a form or following a menu link should leave the menu closed behind it.
  masthead.addEventListener('click', function(e) {
    if (e.target.closest('[data-modal], .nav-link')) setOpen(false);
  });
})();
