import i18next from 'i18next';

import 'bootstrap';
import ru from './texts.js';
import './style.scss';

import watchedState from './view.js';
import validate from './validate.js';
import parseFeed from './parse.js';

const render = (feedsList) => {
  console.log('feed list is: ', feedsList);

  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');
  
  // Headers
  if (feeds) {
    feeds.innerHTML = '';
  
    const feedsContainer = document.createElement('div');
    feedsContainer.classList.add('card', 'border-0');
    const feedsContainerHeader = document.createElement('div');
    feedsContainerHeader.classList.add('card-body');
    const titleFeeds = document.createElement('h2');
    titleFeeds.classList.add('card-title', 'h4');
    titleFeeds.textContent = 'Фиды'; // change to i18

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
    titlePosts.textContent = 'Посты'; // change to i18

    postsContainerHeader.append(titlePosts);
    postsContainer.append(postsContainerHeader);

    posts.append(postsContainer);
  }
  // Content
  const loadedFeedsList = document.createElement('ul');
  loadedFeedsList.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.append(loadedFeedsList);

  const loadedPostsList = document.createElement('ul');
  loadedPostsList.classList.add('list-group', 'border-0', 'rounded-0');
  posts.append(loadedPostsList);

  feedsList.forEach(parseFeed);

};

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: { ru }
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  // Model
  const initialState = {
    inputUrl: {
      stat: 'invalid',
      data: {
        url: '',
      },
      feeds: [],
      errors: [],
    },
  };

  // View
  const state = watchedState(initialState);

  // Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    state.inputUrl.data.url = value;

    validate(state.inputUrl.data.url, initialState)
      .then((val) => {
        // console.log(val);
        state.inputUrl.errors = [];
        elements.fields.url.value = '';
        initialState.inputUrl.feeds.push(val.url);
        // console.log(state.inputUrl.feeds);
        state.inputUrl.stat = 'valid';
        elements.fields.url.classList.remove('is-invalid');
        elements.feedback.textContent = '';
      })
      .catch((err) => {
        state.inputUrl.errors.push(err.message);
        state.inputUrl.stat = 'invalid';
        elements.fields.url.value = '';
        elements.fields.url.classList.add('is-invalid');
        // console.log(state.inputUrl.errors);
        elements.feedback.textContent = err.message;
      });

    render(state.inputUrl.feeds);
  });
};
