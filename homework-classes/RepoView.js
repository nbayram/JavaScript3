'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    render(repo) {
      // TODO: replace this comment and the console.log with your own code
      this.container.innerHTML = '';
      const li = createAndAppend('li', this.container);
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
  }

  window.RepoView = RepoView;
}
