import i18next from 'i18next';
import { cloneDeep, forEach } from 'lodash';

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

  const prepareForParsing = (val) => {
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

  const prepareForRender = ({ feedId, title, description, posts }) => {
    if (feedId === undefined) {
      feedId = Object.keys(state.content.feeds).length;
    }
    
    const updatedContent = cloneDeep(state.content);
    if (title) {
      const thisFeed = { feedId, title, description };
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

    elements.fields.url.value = '';
    elements.fields.url.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = err.message;
  };

  const compareHeaders = (newPosts, oldPosts) => { // FIX feeds undefined and 0 postId
    const feedId = newPosts.feedId;
    // console.log('newPosts: ', newPosts);
    // console.log('oldPosts: ', oldPosts);

    const oldPostsHeaders = oldPosts.map((post) => post.title);
    // console.log('oldPostsHeaders is: ', oldPostsHeaders);

    const compareResult = newPosts.posts.filter((post) => {
      // console.log('post title is: ', post.title);
      // console.log('this post includes? - ', oldPostsHeaders.includes(post.title));
      return !oldPostsHeaders.includes(post.title);
    });
    // console.log('compareResult is: ', compareResult);
    return { posts: compareResult };
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validate(value, feedlist)
      .then(prepareForParsing)
      .then(parse)
      .then(prepareForRender)
      .catch(errorHandler);
  });

  const run = (list) => {
    
    if (list.length) {
      console.log('list is: ', list);
      list.forEach((item) => {
        parse(item)
          .then((newPsts) => compareHeaders(newPsts, state.content.posts))
          .then(prepareForRender)
          .catch(errorHandler);
      })
    }
    setTimeout(() => run(feedlist), 5000);
  };

  setTimeout(() => run(feedlist), 5000);
};
