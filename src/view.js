import onChange from 'on-change';
import i18next from 'i18next';

const feeds = document.querySelector('.feeds');
const posts = document.querySelector('.posts');
const modal = document.querySelector('.modal');

const createHeader = (header) => {
  const element = document.querySelector(`.${header}`);

  element.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18next.t(`listHeaders.${header}`);

  containerHeader.append(title);
  container.append(containerHeader);
  element.append(container);
};

const addFeeds = (feeddsList) => {
  const loadedFeedsList = document.createElement('ul');
  loadedFeedsList.classList.add('list-group', 'border-0', 'rounded-0');

  feeddsList.forEach((feed) => {
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
    feeds.append(loadedFeedsList);
  });
};

const renderModal = ({ title, text, url }) => {
  modal.setAttribute('id', 'modal');
  modal.innerHTML = '';

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Header
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');

  const headerText = document.createElement('h5');
  headerText.classList.add('modal-title');
  headerText.textContent = title;

  const headerCloseBtn = document.createElement('button');
  headerCloseBtn.classList.add('btn-close');
  headerCloseBtn.setAttribute('data-bs-dismiss', 'modal');
  headerCloseBtn.setAttribute('aria-label', 'Close');

  modalHeader.append(headerText);
  modalHeader.append(headerCloseBtn);

  // Modal body
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const modalBodyText = document.createElement('p');
  modalBodyText.textContent = text;

  modalBody.append(modalBodyText);

  // Modal footer
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer');

  const footerRead = document.createElement('button');
  footerRead.classList.add('btn', 'btn-secondary');
  footerRead.setAttribute('href', url);
  footerRead.textContent = i18next.t('buttons.read');
  footerRead.addEventListener('click', (event) => {
    event.preventDefault();
    window.open(url, '_blank');
  });
  const footerClose = document.createElement('button');
  footerClose.classList.add('btn', 'btn-primary');
  footerClose.setAttribute('data-bs-dismiss', 'modal');
  footerClose.textContent = i18next.t('buttons.close');

  modalFooter.append(footerRead);
  modalFooter.append(footerClose);

  // Matryoshka
  modalContent.append(modalHeader);
  modalContent.append(modalBody);
  modalContent.append(modalFooter);

  modalDialog.append(modalContent);

  modal.append(modalDialog);
};

const addPosts = (postsList, visited) => { // FIX trimm to 25 lines
  const loadedPostsList = document.createElement('ul');
  loadedPostsList.classList.add('list-group', 'border-0', 'rounded-0');

  postsList.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const href = document.createElement('a');
    href.classList.add('fw-bold');
    if (visited.includes(post.title)) {
      href.classList.replace('fw-bold', 'fw-normal');
    }

    href.setAttribute('href', post.url);
    href.textContent = post.title;

    href.addEventListener('click', (e) => {
      e.preventDefault();
      href.classList.replace('fw-bold', 'fw-normal');
      window.open(post.url, '_blank');
    });

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.textContent = i18next.t('buttons.view');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      href.classList.replace('fw-bold', 'fw-normal');
      renderModal({
        title: post.title,
        text: post.text,
        url: post.url,
      });
    });

    postItem.append(href);
    postItem.append(btn);
    loadedPostsList.append(postItem);
  });
  posts.append(loadedPostsList);
};

const render = (path, content) => {
  if (path === 'content') {
    createHeader('feeds');
    addFeeds(content.feeds);

    createHeader('posts');
    addPosts(content.posts, content.visited);
  }

  if (path === 'modal') {
    renderModal(content);
  }
};

const watchedState = (state) => onChange(state, render);

export default watchedState;

// https://feeds.simplecast.com/54nAGcIl
// https://www.theguardian.com/international/rss
