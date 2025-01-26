import i18next from 'i18next';
import { cloneDeep } from 'lodash';

import 'bootstrap';
import ru from './texts.js';
import './style.scss';

import watchedState from './view.js';
import validate from './validate.js';
import parse from './parse.js';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: { ru },
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
      url: '',
      feedList: [],
      errors: [],
    },
    content: {
      feeds: [],
      posts: [],
    },
  };

  // View
  const state = watchedState(initialState);

  // Controller
  const feedlist = [...state.inputUrl.feedList];

  const afterValidateHandler = (val) => {
    feedlist.push(val.url);
    state.inputUrl = {
      stat: 'valid',
      errors: [],
      feedlist,
    };
    elements.fields.url.value = '';
    elements.fields.url.classList.remove('is-invalid');
    elements.feedback.textContent = '';
    return val.url;
  };

  const afterParserHandler = (parsedData) => {
    const feedId = Object.keys(state.content.feeds).length;
    const { title, description, posts } = parsedData;
    const thisFeed = { feedId, title, description };
    const postsWithFeedId = posts.map((post) => {
      const postWithID = post;
      postWithID.feedId = feedId;
      return postWithID;
    });
    const updatedContent = cloneDeep(state.content);
    updatedContent.feeds.push(thisFeed);
    updatedContent.posts.push(...postsWithFeedId);
    state.content = updatedContent;

    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = i18next.t('errors.downloadSuccess');
  };

  const errorHandler = (err) => {
    state.inputUrl.errors.push(err.message);
    state.inputUrl.stat = 'invalid';

    elements.fields.url.value = '';
    elements.fields.url.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = err.message;
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validate(value, feedlist)
      .then(afterValidateHandler)
      .then(parse)
      .then(afterParserHandler)
      .catch(errorHandler);
  });
};
