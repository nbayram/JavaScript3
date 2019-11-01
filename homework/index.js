'use strict';

function fetchJSON(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      cb(null, xhr.response);
    } else {
      cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
    }
  };
  xhr.onerror = () => cb(new Error('Network request failed'));
  xhr.send();
}

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'text') {
      elem.textContent = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

function renderRepoDetails(repo, ul) {
  const li = createAndAppend('li', ul);
  const table = createAndAppend('table', li);

  const headers = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
  const keys = ['name', 'description', 'forks', 'updated_at'];

  for (let i = 0; i < headers.length; ++i) {
    let tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: headers[i] });
    if (i === 0) {
      let td = createAndAppend('td', tr);
      // When a user clicks on any of the repository names it will show more details about it.
      createAndAppend('a', td, { href: repo.html_url, text: repo['name'] });
    } else {
      createAndAppend('td', tr, { text: repo[keys[i]] });
    }
  }
}

function main(url) {
  const root = document.getElementById('root');
  createAndAppend('header', root, { text: 'HYF Repositories' });
  fetchJSON(url, (err, repos) => {
    if (err) {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
      return;
    }
    const ul = createAndAppend('ul', root);
    repos
      // It displays those repositories in an alphabetically - unordered list.   
      .sort((currentRepo, nextRepo) => currentRepo.name.localeCompare(nextRepo.name))
      .forEach(repo => renderRepoDetails(repo, ul));
  });
}

const HYF_REPOS_URL =
  // Display the first 10 items in the HTML file (write JavaScript to add element to the DOM)
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=10';
window.onload = () => main(HYF_REPOS_URL);