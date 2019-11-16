'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      // TODO: replace this comment and the console.log with your own code
      this.container.textContent = '';
      contributors.forEach(contributor => {
        const li = createAndAppend('li', this.container);
        createAndAppend('img', li, { src: contributor.avatar_url });
        const spanLogin = createAndAppend('span', li, { class: 'login' });
        createAndAppend('a', spanLogin, { text: contributor.login, href: contributor.html_url });
        createAndAppend('span', li, { class: 'contributions', text: contributor.contributions });
      })
      // console.log('ContributorsView', contributors);
    }
  }

  window.ContributorsView = ContributorsView;
}
