import i18next from 'i18next';
import axios from 'axios';

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
    fieldUrl: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
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
      visited: [],
    },
    modal: {
      title: '',
      text: '',
      url: '',
    },
  };

  // View
  const state = watchedState(initialState);

  // Controller
  const feedlist = [...state.inputUrl.feedList];

  const download = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    console.log('all resp: ', response);

    console.log('resp status: ', response.data.status);

    if (response.data.status.http_code === 200) {
      return response;
    }
    if (response.data.status.http_code > 404) {
      throw new Error(i18next.t('errors.downloadFail'));
    }
    throw new Error(i18next.t('errors.notValidUrl'));
  });

  const prepareForParsing = (val) => {
    feedlist.push(val.url);
    state.inputUrl = {
      stat: 'valid',
      errors: [],
      feedlist,
    };
    elements.fieldUrl.value = '';
    elements.fieldUrl.classList.remove('is-invalid');
    elements.feedback.textContent = '';
    return val.url;
  };

  const prepareForRender = ({
    feedId,
    title,
    description,
    posts,
  }) => {
    let id = feedId;
    if (id === undefined) {
      id = Object.keys(state.content.feeds).length;
    }

    const updatedContent = { ...state.content };

    if (title) {
      const thisFeed = { feedId: id, title, description };
      updatedContent.feeds.push(thisFeed);
    }

    const postsWithFeedId = posts.map((post) => {
      const postWithID = post;
      postWithID.feedId = feedId;
      return postWithID;
    });
    updatedContent.posts.push(...postsWithFeedId);
    state.content = updatedContent;

    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = i18next.t('errors.downloadSuccess');
  };

  const errorHandler = (err) => {
    state.inputUrl.errors.push(err.message);
    state.inputUrl.stat = 'invalid';

    elements.fieldUrl.value = '';
    elements.fieldUrl.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = err.message;
  };

  const compareHeaders = (newPosts, oldPosts) => {
    const oldPostsHeaders = oldPosts.map((post) => post.title);
    const compareResult = newPosts.posts.filter((post) => !oldPostsHeaders.includes(post.title));
    return { posts: compareResult };
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validate(value, feedlist)
      .then(prepareForParsing)
      .then(download)
      .then(parse)
      .then(prepareForRender)
      .catch(errorHandler);
  });

  elements.posts.addEventListener('click', (e) => {
    e.preventDefault();
    const data = e.target.parentNode;
    if (e.target.nodeName === 'LI') {
      return;
    }
    state.content.visited.push(data.firstChild.textContent);
  });

  const run = (list) => {
    if (list.length) {
      list.forEach((url) => {
        download(url)
          .then(parse)
          .then((newPsts) => compareHeaders(newPsts, state.content.posts))
          .then(prepareForRender)
          .catch(errorHandler);
      });
    }
    setTimeout(() => run(feedlist), 5000);
  };
  setTimeout(() => run(feedlist), 5000);
};
