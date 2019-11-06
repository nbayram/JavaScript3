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

  let tr = createAndAppend('tr', table);
  createAndAppend('th', tr, { text: 'Repository:' });
  let td = createAndAppend('td', tr);
  createAndAppend('a', td, { href: repo.html_url, text: repo.name });

  tr = createAndAppend('tr', table);
  createAndAppend('th', tr, { text: 'Description:' });
  td = createAndAppend('td', tr, { text: repo.description });

  tr = createAndAppend('tr', table);
  createAndAppend('th', tr, { text: 'Forks:' });
  td = createAndAppend('td', tr, { text: repo.forks });

  tr = createAndAppend('tr', table);
  createAndAppend('th', tr, { text: 'Updated:' });
  td = createAndAppend('td', tr, { text: repo.updated_at });
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