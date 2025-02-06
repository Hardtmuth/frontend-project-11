import onChange from 'on-change';
import i18next from 'i18next';

const feeds = document.querySelector('.feeds');
const posts = document.querySelector('.posts');
const modal = document.querySelector('.modal');

const isVivsted = (postId, visitedList) => visitedList.includes(postId);

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

const addPosts = (postsList, visited) => { // FIX trimm to 25 lines
  const loadedPostsList = document.createElement('ul');
  loadedPostsList.classList.add('list-group', 'border-0', 'rounded-0');

  postsList.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const href = document.createElement('a');
    href.classList.add('fw-bold');
    visited.includes(post.postId) ? href.classList.add('fw-normal') : href.classList.add('fw-bold');

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
};

const watchedState = (state) => onChange(state, render);

export default watchedState;

// https://feeds.simplecast.com/54nAGcIl
// https://www.theguardian.com/international/rss
