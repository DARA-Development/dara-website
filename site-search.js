(function() {
  var form = document.querySelector('.site-search');
  if (!form) return;

  var input = form.querySelector('input[type="search"]');
  var results = form.querySelector('.site-search-results');
  var indexPromise;

  function collectSections(doc, pageUrl) {
    return Array.from(doc.querySelectorAll('main section[id]')).map(function(section) {
      var heading = section.querySelector('h1, h2, h3');
      return {
        title: heading ? heading.textContent.trim() : section.id,
        text: section.textContent.replace(/\s+/g, ' ').trim(),
        url: new URL(pageUrl.pathname + '#' + section.id, window.location.origin).href
      };
    });
  }

  function getSiteIndex() {
    if (!indexPromise) {
      var currentUrl = new URL(window.location.href);
      var currentIsAboutPage = currentUrl.pathname.endsWith('/about_us.html');
      var otherPageUrl = new URL(currentIsAboutPage ? 'index.html' : 'about_us.html', currentUrl);
      indexPromise = fetch(otherPageUrl.href).then(function(response) {
        if (!response.ok) throw new Error('Search index request failed: ' + response.status);
        return response.text();
      }).then(function(html) {
        var otherDocument = new DOMParser().parseFromString(html, 'text/html');
        return collectSections(document, currentUrl).concat(collectSections(otherDocument, otherPageUrl));
      }).catch(function(error) {
        indexPromise = null;
        throw error;
      });
    }
    return indexPromise;
  }

  function showMessage(message) {
    results.replaceChildren();
    var paragraph = document.createElement('p');
    paragraph.className = 'site-search-message';
    paragraph.textContent = message;
    results.appendChild(paragraph);
    results.hidden = false;
  }

  function displayMatches(matches, query) {
    results.replaceChildren();
    if (!matches.length) {
      showMessage('No results found for "' + query + '".');
      return;
    }

    var message = document.createElement('p');
    message.className = 'site-search-message';
    message.textContent = matches.length + (matches.length === 1 ? ' result' : ' results') + ' for "' + query + '"';
    results.appendChild(message);

    var list = document.createElement('ul');
    matches.slice(0, 8).forEach(function(match) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = match.url;
      var title = document.createElement('strong');
      title.textContent = match.title;
      var summary = document.createElement('span');
      summary.textContent = match.text.length > 150 ? match.text.slice(0, 147) + '...' : match.text;
      link.append(title, summary);
      item.appendChild(link);
      list.appendChild(item);
    });
    results.appendChild(list);
    results.hidden = false;
  }

  results.addEventListener('click', function(event) {
    if (event.target.closest('a')) results.hidden = true;
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var query = input.value.trim();
    if (!query) {
      showMessage('Enter a search term.');
      input.focus();
      return;
    }

    showMessage('Searching…');
    var terms = query.toLocaleLowerCase().split(/\s+/);
    getSiteIndex().then(function(index) {
      var matches = index.map(function(item) {
        var searchableText = (item.title + ' ' + item.text).toLocaleLowerCase();
        var matchingTerms = terms.filter(function(term) {
          return searchableText.indexOf(term) !== -1;
        });
        return { item: item, score: matchingTerms.length + (terms.every(function(term) {
          return item.title.toLocaleLowerCase().indexOf(term) !== -1;
        }) ? terms.length : 0) };
      }).filter(function(result) {
        return result.score >= terms.length;
      }).sort(function(a, b) {
        return b.score - a.score;
      }).map(function(result) {
        return result.item;
      });
      displayMatches(matches, query);
    }).catch(function(error) {
      console.error('Site search failed.', error);
      showMessage('Search is unavailable right now. Please try again.');
    });
  });

  input.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') results.hidden = true;
  });
})();
