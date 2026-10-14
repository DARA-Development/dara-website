(function() {
  // Where enquiries are delivered. Change the address here to redirect every form on the site.
  var FORM_ENDPOINT = 'https://formsubmit.co/admin@teamdara.com';

  // options.general marks a general enquiry: organisation is optional and the wording says "message" rather than "request".
  // options.country adds a required Country field.
  function formModal(kind, title, intro, subject, options) {
    var general = Boolean(options && options.general);
    return '<dialog id="modal-' + kind + '">' +
      '<div class="modal-inner">' +
        '<button class="modal-close" data-close aria-label="Close">&times;</button>' +
        '<div class="modal-form">' +
          '<h2>' + title + '</h2>' +
          (intro ? '<p class="sub-modal">' + intro + '</p>' : '') +
          '<form action="' + FORM_ENDPOINT + '" method="POST" data-form="' + kind + '">' +
            '<input type="hidden" name="_subject" value="' + subject + '">' +
            '<input type="hidden" name="_captcha" value="false">' +
            '<input type="hidden" name="_template" value="table">' +
            '<input class="form-honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
            '<div class="field"><label for="' + kind + '-name">Name</label><input id="' + kind + '-name" type="text" name="name" autocomplete="name" maxlength="100" required></div>' +
            '<div class="field"><label for="' + kind + '-email">' + (general ? 'Email' : 'Work email') + '</label><input id="' + kind + '-email" type="email" name="email" autocomplete="email" maxlength="200" required></div>' +
            '<div class="field"><label for="' + kind + '-organisation">' + (general ? 'Organisation (optional)' : 'Organisation') + '</label><input id="' + kind + '-organisation" type="text" name="organisation" autocomplete="organization" maxlength="150"' + (general ? '' : ' required') + '></div>' +
            (options && options.country ? '<div class="field"><label for="' + kind + '-country">Country</label><input id="' + kind + '-country" type="text" name="country" autocomplete="country-name" maxlength="100" required></div>' : '') +
            '<div class="field"><label for="' + kind + '-message">Message</label><textarea id="' + kind + '-message" name="message" rows="4" maxlength="4000" required></textarea></div>' +
            '<p class="form-privacy">We use these details only to reply to your ' + (general ? 'message' : 'request') + '. See our <a href="privacy.html">Privacy Policy</a>.</p>' +
            '<p class="form-error" role="alert" hidden></p>' +
            '<div class="modal-actions">' +
              '<button type="button" class="btn btn-outline" data-close>Cancel</button>' +
              '<button type="submit" class="btn btn-brand">' + (general ? 'Send message' : 'Send request') + '</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
        '<div class="modal-success">' +
          '<h2>' + (general ? 'Message sent' : 'Request sent') + '</h2>' +
          '<p>We\'ll be in touch shortly. Close this window to keep browsing.</p>' +
        '</div>' +
      '</div>' +
    '</dialog>';
  }

  document.body.insertAdjacentHTML('beforeend',
    formModal('contact', 'Contact us', 'Send us a question or a message and we\'ll get back to you.', 'DARA Telecom contact enquiry', { general: true }) +
    formModal('demo', 'Request a demo', '', 'DARA Telecom demo request', { country: true }) +
    formModal('partner', 'Become a partner', '', 'DARA Telecom partnership enquiry', { country: true }) +
    '<dialog id="modal-login">' +
      '<div class="modal-inner">' +
        '<button class="modal-close" data-close aria-label="Close">&times;</button>' +
        '<h2>Portal login</h2>' +
        '<p class="sub-modal">The DARA Telecom partner portal isn\'t live yet. Reach out and we\'ll set you up with early access once it launches.</p>' +
        '<div class="modal-actions">' +
          '<button type="button" class="btn btn-outline" data-close>Close</button>' +
          '<button type="button" class="btn btn-brand" data-modal="partner" data-modal-switch>Request access</button>' +
        '</div>' +
      '</div>' +
    '</dialog>');

  var modals = { contact: document.getElementById('modal-contact'), demo: document.getElementById('modal-demo'), partner: document.getElementById('modal-partner'), login: document.getElementById('modal-login') };
  document.querySelectorAll('[data-modal]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      if (btn.hasAttribute('data-modal-link')) e.preventDefault();
      if (btn.hasAttribute('data-modal-switch')) { btn.closest('dialog').close(); }
      var dlg = modals[btn.getAttribute('data-modal')];
      var form = dlg.querySelector('.modal-form');
      var success = dlg.querySelector('.modal-success');
      var error = dlg.querySelector('.form-error');
      if (form) form.style.display = '';
      if (success) success.classList.remove('active');
      if (error) error.hidden = true;
      dlg.showModal();
    });
  });
  document.querySelectorAll('[data-close]').forEach(function(btn) {
    btn.addEventListener('click', function() { btn.closest('dialog').close(); });
  });
  document.querySelectorAll('dialog').forEach(function(dlg) {
    dlg.addEventListener('click', function(e) { if (e.target === dlg) dlg.close(); });
  });
  var hashModal = { '#contact': 'contact', '#demo': 'demo', '#partners': 'partner', '#login': 'login' }[window.location.hash];
  var hashTrigger = hashModal && document.querySelector('[data-modal="' + hashModal + '"]');
  if (hashTrigger) hashTrigger.click();

  document.querySelectorAll('form[data-form]').forEach(function(form) {
    var dlg = form.closest('dialog');
    var submitButton = form.querySelector('button[type="submit"]');
    var submitLabel = submitButton.textContent;
    var error = form.querySelector('.form-error');
    function showSuccess() {
      form.reset();
      dlg.querySelector('.modal-form').style.display = 'none';
      dlg.querySelector('.modal-success').classList.add('active');
    }
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form));
      // Bots fill the hidden honeypot field; drop those without telling them.
      if (data._honey) { showSuccess(); return; }
      Object.keys(data).forEach(function(key) { data[key] = data[key].trim(); });
      var controller = new AbortController();
      var timeout = setTimeout(function() { controller.abort(); }, 15000);
      error.hidden = true;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      fetch(FORM_ENDPOINT.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal
      }).then(function(response) {
        if (!response.ok) throw new Error('Form submission failed');
        return response.json();
      }).then(function(result) {
        // FormSubmit reports success as the string "true" or "false".
        if (String(result.success) !== 'true') throw new Error('Form submission failed');
        showSuccess();
      }).catch(function() {
        error.textContent = "Sorry, we couldn't send your " + (form.getAttribute('data-form') === 'contact' ? 'message' : 'request') + ". Please check your connection and try again.";
        error.hidden = false;
      }).then(function() {
        clearTimeout(timeout);
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      });
    });
  });
})();
