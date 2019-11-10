'use strict';

// The XMLHttpRequest in the fetchJSON function should be replaced with fetch.Hint: Because fetch returns a promise out of the box there is no need create a Promise yourself with new Promise(...).
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (response.ok) return response.json();
    throw new Error(`Network Error: ${response.status} : ${response.statusText}`);
  } catch (err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
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

async function main(url) {
  const root = document.getElementById('root');
  const header = createAndAppend('header', root, { text: 'HYF Repositories' });
  const main = createAndAppend('main', root, { class: 'main-container' });
  const sectionRepo = createAndAppend('section', main, { class: 'repo-container' });
  const sectionContributors = createAndAppend('section', main, { class: 'contributors-container' });
  const select = createAndAppend('select', header);
  createAndAppend('h4', sectionContributors, { text: 'Contributors' });

  try {
    const repos = await fetchJSON(url);
    const ulLeft = createAndAppend('ul', sectionRepo);
    const ulRight = createAndAppend('ul', sectionContributors);
    const sortedRepos = repos.sort((currentRepo, nextRepo) => currentRepo.name.localeCompare(nextRepo.name));
    sortedRepos.forEach((repo, index) => {
      createAndAppend('option', select, { value: index, text: repo.name });
    });

    renderRepoDetails(sortedRepos[select.selectedIndex], ulLeft);

    let contributors = await fetchJSON(sortedRepos[select.selectedIndex].contributors_url)
    contributors.forEach(contributor => renderContributors(contributor, ulRight));

    select.onchange = async () => {
      ulLeft.textContent = '';
      ulRight.textContent = '';
      renderRepoDetails(sortedRepos[select.selectedIndex], ulLeft);
      contributors = await fetchJSON(sortedRepos[select.selectedIndex].contributors_url);
      contributors.forEach(contributor => renderContributors(contributor, ulRight));
    }
  } catch (err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
