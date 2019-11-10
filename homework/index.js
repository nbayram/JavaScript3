'use strict';

// The XMLHttpRequest in the fetchJSON function should be replaced with fetch.
// Hint: Because fetch returns a promise out of the box there is no need create a Promise yourself with new Promise(...).
function fetchJSON(url) {
  return fetch(url)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(`Network Error: ${response.status} : ${response.statusText}`);
    })
};

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

// You should be able to click on a contributor to open a new browser tab with the GitHub page for that contributor.
function renderContributors(contributor, ul) {
  const li = createAndAppend('li', ul);
  createAndAppend('img', li, { src: contributor.avatar_url });
  const spanLogin = createAndAppend('span', li, { class: 'login' });
  createAndAppend('a', spanLogin, { text: contributor.login, href: contributor.html_url });
  createAndAppend('span', li, { class: 'contributions', text: contributor.contributions });
}

function renderRepoDetails(repo, ul) {
  const li = createAndAppend('li', ul);
  const table = createAndAppend('table', li);

  let tr = createAndAppend('tr', table);
  createAndAppend('th', tr, { text: 'Repository:' });
  let td = createAndAppend('td', tr);

  // You should be able to click on the repository name of the selected repository to open a new browser tab with the GitHub page for that repository.
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

const x = () => {

}

function main(url) {
  const root = document.getElementById('root');
  const header = createAndAppend('header', root, { text: 'HYF Repositories' });
  const main = createAndAppend('main', root, { class: 'main-container' });
  const sectionRepo = createAndAppend('section', main, { class: 'repo-container' });
  const sectionContributors = createAndAppend('section', main, { class: 'contributors-container' });
  const select = createAndAppend('select', header);
  createAndAppend('h4', sectionContributors, { text: 'Contributors' });

  fetchJSON(url)
    .then(repos => {
      const ulLeft = createAndAppend('ul', sectionRepo);
      const ulRight = createAndAppend('ul', sectionContributors);


      const sortedRepos = repos.sort((currentRepo, nextRepo) => currentRepo.name.localeCompare(nextRepo.name));

      // The list of repositories in the select element should be sorted(case -insensitive) on repository name.
      sortedRepos.forEach((repo, index) => {

        // An HTML select element from which the user can select a HYF repository.This select element must be populated with option elements, one for each HYF repository.
        // Add one option element per repository to the select element, where each option element has the array index of the repository as its value attribute and the name of the repository as its text content:
        createAndAppend('option', select, { value: index, text: repo.name });
      });

      // At start - up your application should display information about the first repository as displayed in the select element.
      renderRepoDetails(sortedRepos[select.selectedIndex], ulLeft);
      fetchJSON(sortedRepos[select.selectedIndex].contributors_url)
        .then(contributors => contributors.forEach(contributor => renderContributors(contributor, ulRight)));

      // When the user changes the selection, the information in the web page should be refreshed for the newly selected repository.
      select.onchange = () => {
        ulLeft.textContent = '';
        ulRight.textContent = '';
        renderRepoDetails(sortedRepos[select.selectedIndex], ulLeft);
        fetchJSON(sortedRepos[select.selectedIndex].contributors_url)
          .then(contributors => contributors.forEach(contributor => renderContributors(contributor, ulRight)));
      };
    })
    .catch((err) => {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    })
}

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);