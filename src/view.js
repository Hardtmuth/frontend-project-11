import onChange from 'on-change';
import i18next from 'i18next';

const render = (path, content) => {
  console.log('Start RENDER with data: ', '\n', 'Path is: ', path, '\n', 'Content is: ', content);

  if (path === 'content') {
    const feeds = document.querySelector('.feeds');
    const posts = document.querySelector('.posts');
    const modal = document.querySelector('.modal');

    console.log(content.visited);

    // Headers
    if (feeds) {
      feeds.innerHTML = '';

      const feedsContainer = document.createElement('div');
      feedsContainer.classList.add('card', 'border-0');
      const feedsContainerHeader = document.createElement('div');
      feedsContainerHeader.classList.add('card-body');
      const titleFeeds = document.createElement('h2');
      titleFeeds.classList.add('card-title', 'h4');
      titleFeeds.textContent = i18next.t('listHeaders.feeds');

      feedsContainerHeader.append(titleFeeds);
      feedsContainer.append(feedsContainerHeader);
      feeds.append(feedsContainer);
    }

    if (posts) {
      posts.innerHTML = '';

      const postsContainer = document.createElement('div');
      postsContainer.classList.add('card', 'border-0');
      const postsContainerHeader = document.createElement('div');
      postsContainerHeader.classList.add('card-body');
      const titlePosts = document.createElement('h2');
      titlePosts.classList.add('card-title', 'h4');
      titlePosts.textContent = i18next.t('listHeaders.posts');

      postsContainerHeader.append(titlePosts);
      postsContainer.append(postsContainerHeader);
      posts.append(postsContainer);
    }
    // Content
    const loadedFeedsList = document.createElement('ul');
    loadedFeedsList.classList.add('list-group', 'border-0', 'rounded-0');

    const loadedPostsList = document.createElement('ul');
    loadedPostsList.classList.add('list-group', 'border-0', 'rounded-0');

    content.feeds.forEach((feed) => {
      const feedCard = document.createElement('li');
      feedCard.classList.add('list-group-item', 'border-0', 'border-end-0');

      const feedCardHeader = document.createElement('h3');
      feedCardHeader.classList.add('h6', 'm-0');
      feedCardHeader.textContent = feed.title;

      const feedCardDescr = document.createElement('p');
      feedCardDescr.classList.add('m-0', 'small', 'text-black-50');
      feedCardDescr.textContent = feed.description;

      feedCard.append(feedCardHeader);
      feedCard.append(feedCardDescr);
      loadedFeedsList.append(feedCard);
    });

    content.posts.forEach((post) => {
      const postItem = document.createElement('li');
      postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const href = document.createElement('a');
      href.classList.add('fw-bold');
      if (content.visited.includes(post.title)) {
        href.classList.replace('fw-bold', 'fw-normal');
      }

      href.setAttribute('href', post.url);
      href.textContent = post.title;

      href.addEventListener('click', (e) => {
        e.preventDefault();
        href.classList.replace('fw-bold', 'fw-normal');
        window.open(post.url, '_blank');
      })

      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', `#modal`);
      btn.textContent = i18next.t('buttons.view');
      // Modal
      btn.addEventListener('click' , (e) => {
        e.preventDefault();
        href.classList.replace('fw-bold', 'fw-normal');
        modal.setAttribute('id', 'modal');

        modal.innerHTML = '';


        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog');
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');


        // header
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        const headerText = document.createElement('h5');
        headerText.classList.add('modal-title');
        headerText.textContent = post.title;

        const headerCloseBtn = document.createElement('button');
        headerCloseBtn.classList.add('btn-close');
        headerCloseBtn.setAttribute('data-bs-dismiss', 'modal');
        headerCloseBtn.setAttribute('aria-label', 'Close');

        modalHeader.append(headerText);
        modalHeader.append(headerCloseBtn);

        // modal body
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        const modalBodyText = document.createElement('p');
        modalBodyText.textContent = post.text;

        modalBody.append(modalBodyText);

        // modal footer
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        const footerRead = document.createElement('button');
        footerRead.classList.add('btn', 'btn-secondary');
        footerRead.setAttribute('href', post.href);
        // footerRead.setAttribute('data-bs-dismiss', 'modal');
        footerRead.textContent = 'Читать полностью'; // FIX change to i18
        footerRead.addEventListener('click' , (e) => {
          e.preventDefault();
          window.open(post.url, '_blank');
        });

        const footerClose = document.createElement('button');
        footerClose.classList.add('btn', 'btn-primary');
        footerClose.setAttribute('data-bs-dismiss', 'modal');
        footerClose.textContent = 'Закрыть'; // FIX change to i18

        modalFooter.append(footerRead);
        modalFooter.append(footerClose);

        // Matryoshka
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalContent.append(modalFooter);

        modalDialog.append(modalContent);

        modal.append(modalDialog);
      });

      postItem.append(href);
      postItem.append(btn);
      loadedPostsList.append(postItem);
    });

    feeds.append(loadedFeedsList);
    posts.append(loadedPostsList);
  }
};

const watchedState = (state) => onChange(state, render);

export default watchedState;

// https://feeds.simplecast.com/54nAGcIl
// https://www.theguardian.com/international/rss
